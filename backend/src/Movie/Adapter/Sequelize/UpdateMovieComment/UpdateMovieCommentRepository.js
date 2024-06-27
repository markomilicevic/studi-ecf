import { Op } from "sequelize";

import MovieCommentModel from "../MovieCommentModel.js";

export default class UpdateMovieCommentRepository {
	async exists({ movieCommentId }) {
		const query = {
			where: {
				movieCommentId: { [Op.eq]: movieCommentId },
			},
		};
		return !!(await MovieCommentModel.findOne(query));
	}

	async update({ movieCommentId, status }) {
		await MovieCommentModel.update(
			{
				status,
			},
			{
				where: {
					movieCommentId: { [Op.eq]: movieCommentId },
				},
			}
		);
		return true;
	}
}
