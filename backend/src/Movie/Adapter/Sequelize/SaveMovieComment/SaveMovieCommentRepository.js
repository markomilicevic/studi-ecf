import { Op } from "sequelize";

import MovieCommentModel from "../MovieCommentModel.js";

export default class SaveMovieCommentRepository {
	async exists({ sessionId, userId }) {
		const query = {
			where: {
				sessionId: { [Op.eq]: sessionId },
				userId: { [Op.eq]: userId },
			},
		};
		return !!(await MovieCommentModel.findOne(query));
	}

	async create({ movieCommentId, sessionId, movieId, userId, comment, status }) {
		await MovieCommentModel.create({
			movieCommentId,
			sessionId,
			movieId,
			userId,
			comment,
			status,
		});
		return true;
	}

	async update({ sessionId, userId, comment, status }) {
		await MovieCommentModel.update(
			{
				comment,
				status,
			},
			{
				where: {
					sessionId: { [Op.eq]: sessionId },
					userId: { [Op.eq]: userId },
				},
			}
		);
		return true;
	}
}
