import { Op } from "sequelize";

import MovieRatingModel from "../MovieRatingModel.js";

import MovieRating from "../../../Business/MovieRating.js";
import Session from "../../../Business/Session.js";

export default class GetBookingMovieRatingsRepository {
	async fetchAll({ sessionIds, userId }) {
		const query = {
			where: {
				sessionId: { [Op.in]: sessionIds },
				userId: { [Op.eq]: userId },
			},
		};
		const movieRatings = await MovieRatingModel.findAll(query);

		return movieRatings.map((movieRating) => {
			const obj = new MovieRating();
			obj.setMovieRatingId(movieRating.movieRatingId);
			obj.setRating(movieRating.rating);

			const s = new Session();
			s.setSessionId(movieRating.sessionId);
			obj.setSession(s);

			return obj;
		});
	}
}
