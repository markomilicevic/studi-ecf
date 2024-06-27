import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import MovieRating from "../../Business/MovieRating.js";

export default class SaveMovieRatingService {
	constructor(movieRatingRepository, movieRepository) {
		this.movieRatingRepository = movieRatingRepository;
		this.movieRepository = movieRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!query.movieId) {
			errors.push("INVALID_MOVIE_ID");
		}
		if (!query.userId) {
			errors.push("INVALID_USER_ID");
		}
		if (!query.rating || query.rating < 1 || query.rating > 5) {
			errors.push("INVALID_RATING");
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
				// TODO: Find a way to use Upsert with Sequelize
				if (
					await this.movieRatingRepository.exists({
						sessionId: query.sessionId,
						userId: query.userId,
					})
				) {
					await this.movieRatingRepository.update({
						sessionId: query.sessionId,
						userId: query.userId,
						rating: query.rating,
					});
				} else {
					// It's enough random that duplicates are "near impossible"
					const movieRatingId = crypto.randomUUID();

					await this.movieRatingRepository.create({
						movieRatingId,
						sessionId: query.sessionId,
						movieId: query.movieId,
						userId: query.userId,
						rating: query.rating,
					});

					const movieRating = new MovieRating();
					movieRating.setMovieRatingId(movieRatingId);
					res.setData(movieRating);
				}

				// Get average ranking
				const rating = await this.movieRatingRepository.average({ movieId: query.movieId });

				// Update movie ranking
				await this.movieRepository.update({
					movieId: query.movieId,
					rating,
				});
			});

		return res;
	}
}
