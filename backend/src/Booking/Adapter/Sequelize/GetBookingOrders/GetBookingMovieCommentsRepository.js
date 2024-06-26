import { Op } from "sequelize";

import MovieCommentModel from "../MovieCommentModel.js";

import MovieComment from "../../../Business/MovieComment.js";
import Session from "../../../Business/Session.js";

export default class GetBookingMovieCommentsRepository {
	async fetchAll({ sessionIds, userId }) {
		const query = {
			where: {
				sessionId: { [Op.in]: sessionIds },
				userId: { [Op.eq]: userId },
			},
		};
		const movieComments = await MovieCommentModel.findAll(query);

		return movieComments.map((movieComment) => {
			const obj = new MovieComment();
			obj.setMovieCommentId(movieComment.movieCommentId);
			obj.setStatus(movieComment.status);
			obj.setComment(movieComment.comment);

			const s = new Session();
			s.setSessionId(movieComment.sessionId);
			obj.setSession(s);

			return obj;
		});
	}
}
