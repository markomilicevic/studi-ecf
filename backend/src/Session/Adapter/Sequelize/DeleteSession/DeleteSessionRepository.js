import { Op } from "sequelize";

import SessionModel from "../SessionModel.js";

export default class DeleteSessionRepository {
	async exists({ sessionId }) {
		const query = {
			where: {},
		};
		if (sessionId) {
			query.where.sessionId = { [Op.eq]: sessionId };
		}
		return !!(await SessionModel.findOne(query));
	}

	async destroy({ sessionId }) {
		await SessionModel.destroy({
			where: {
				sessionId: { [Op.eq]: sessionId },
			},
		});
		return true;
	}
}
