import { Op } from "sequelize";

import MovieRatingModel from "../MovieRatingModel.js";

export default class SaveMovieRatingRepository {
	async exists({ sessionId, userId }) {
		const query = {
			where: {
				sessionId: { [Op.eq]: sessionId },
				userId: { [Op.eq]: userId },
			},
		};
		return !!(await MovieRatingModel.findOne(query));
	}

	async create({ movieRatingId, sessionId, movieId, userId, rating }) {
		await MovieRatingModel.create({
			movieRatingId,
			sessionId,
			movieId,
			userId,
			rating,
		});
		return true;
	}

	async update({ sessionId, userId, rating }) {
		await MovieRatingModel.update(
			{
				rating,
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

	async average({ movieId }) {
		// TODO: Find a way to use `AVG(rating)` with Sequelize
		const query = {
			where: {
				movieId: { [Op.eq]: movieId },
			},
		};
		const movieRatings = await MovieRatingModel.findAll(query);
		if (!movieRatings?.length) {
			return 0;
		}

		return movieRatings.reduce((acc, movieRating) => acc += movieRating.rating, 0);
	}
}
