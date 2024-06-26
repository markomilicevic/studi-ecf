import { Op } from "sequelize";

import SessionModel from "../SessionModel.js";

export default class UpdateSessionRepository {
	async exists({ sessionId }) {
		const query = {
			where: {},
		};
		if (sessionId) {
			query.where.sessionId = { [Op.eq]: sessionId };
		}
		return !!(await SessionModel.findOne(query));
	}

	async update({ sessionId, cinemaId, movieId, cinemaRoomId, qualityId, startDate, endDate, standartFreePlaces, disabledFreePlaces }) {
		await SessionModel.update(
			{
				cinemaId,
				movieId,
				cinemaRoomId,
				qualityId,
				startDate,
				endDate,
				standartFreePlaces,
				disabledFreePlaces,
			},
			{
				where: {
					sessionId: { [Op.eq]: sessionId },
				},
			}
		);
		return true;
	}
}
