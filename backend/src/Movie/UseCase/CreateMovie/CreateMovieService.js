import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import Movie from "../../Business/Movie.js";

export default class CreateMovieService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.posterId) {
			errors.push("INVALID_POSTER_ID");
		}
		if (!query.genreId) {
			errors.push("INVALID_GENRE_ID");
		}
		if (!query.title?.length) {
			errors.push("INVALID_TITLE");
		}
		if (!query.description?.length) {
			errors.push("INVALID_DESCRIPTION");
		}
		if (!query.minimalAge || parseInt(query.minimalAge, 10) < 0 || parseInt(query.minimalAge, 10) > 99) {
			errors.push("INVALID_MINIMAL_AGE");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const movieId = crypto.randomUUID();

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.create({
					movieId,
					posterId: query.posterId,
					genreId: query.genreId,
					title: query.title,
					description: query.description,
					minimalAge: query.minimalAge,
					isHighlight: query.isHighlight ? 1 : 0,
					rating: 0.0,
				});

				const movie = new Movie();
				movie.setMovieId(movieId);
				res.setData(movie);
			});

		return res;
	}
}
