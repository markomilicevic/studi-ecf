import { Op } from "sequelize";

import MovieComment from "../../../Business/MovieComment.js";
import User from "../../../Business/User.js";
import MovieCommentModel from "../MovieCommentModel.js";
import UserModel from "../UserModel.js";

export default class GetMovieCommentsRepository {
	async fetchAndCountAll({ movieId, currentPage, limit }) {
		const query = {
			include: [
				{
					model: UserModel,
					required: true,
				},
			],
			where: {
				movieId: { [Op.eq]: movieId },
				status: { [Op.eq]: "approved" },
			},
			order: [["createdAt", "DESC"]],
			offset: (currentPage - 1) * limit,
			limit: limit,
		};
		const { count, rows } = await MovieCommentModel.findAndCountAll(query);

		return {
			count,
			rows: rows.map((movieComment) => {
				const obj = new MovieComment();
				obj.setMovieCommentId(movieComment.movieCommentId);
				obj.setComment(movieComment.comment);

				const u = new User();
				u.setUserId(movieComment.user.userId);
				u.setUserName(movieComment.user.userName);
				obj.setUser(u);

				return obj;
			}),
		};
	}
}
