import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import Movie from "../../Business/Movie.js";

export default class DeleteMovieService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.movieId) {
			errors.push("INVALID_MOVIE_ID");
		}
		if (!(await this.repository.exists({ movieId: query.movieId }))) {
			errors.push("UNKNOWN_MOVIE_ID");
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
				await this.repository.destroy({
					movieId: query.movieId,
				});

				const movie = new Movie();
				movie.setMovieId(query.movieId);
				res.setData(movie);
			});

		return res;
	}
}
