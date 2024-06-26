import { Op } from "sequelize";

import MovieModel from "../MovieModel.js";
import Movie from "../../../Business/Movie.js";

export default class GetMoviesRepository {
	async fetchAll({ movieIds }) {
		const query = {
			where: {
				movieId: { [Op.in]: movieIds },
			},
			order: [["title", "ASC"]],
		};
		const movies = await MovieModel.findAll(query);

		return movies.map((movie) => {
			const obj = new Movie();
			obj.setMovieId(movie.movieId);
			obj.setTitle(movie.title);
			return obj;
		});
	}
}
