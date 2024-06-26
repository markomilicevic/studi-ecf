import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import Session from "../../Business/Session.js";

export default class DeleteSessionService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!(await this.repository.exists({ sessionId: query.sessionId }))) {
			errors.push("UNKNOWN_SESSION_ID");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.destroy({
					sessionId: query.sessionId,
				});

				const session = new Session();
				session.setSessionId(query.sessionId);
				res.setData(session);
			});

		return res;
	}
}
