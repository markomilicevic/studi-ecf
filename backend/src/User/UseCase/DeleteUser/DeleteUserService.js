import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import User from "../../Business/User.js";

export default class DeleteUserService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.destroy({
					userId: query.userId,
				});

				const user = new User();
				user.setUserId(query.userId);
				res.setData(user);
			});

		return res;
	}
}
