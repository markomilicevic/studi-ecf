import { Op } from "sequelize";

import Movie from "../../../Business/Movie.js";
import MovieModel from "../MovieModel.js";
import SessionModel from "../SessionModel.js";

export default class GetMoviesRepository {
	async fetchAll({ cinemaId = null, genreId = null, day = null, limit }) {
		const query = {
			include: [],
			where: {},
			order: [["title", "ASC"]],
			limit,
		};
		if (cinemaId || day) {
			query.include.push({
				model: SessionModel,
				required: true,
				where: {
					...(cinemaId && { cinemaId: { [Op.eq]: cinemaId } }),
					...(day && {
						startDate: {
							[Op.and]: {
								[Op.gte]: day + " 00:00:00",
								[Op.lte]: day + " 23:59:59.999999",
							},
						},
					}),
				},
			});
		}
		if (genreId) {
			query.where.genreId = { [Op.eq]: genreId };
		}
		const movies = await MovieModel.findAll(query);

		return movies.map((movie) => {
			const obj = new Movie();
			obj.setMovieId(movie.movieId);
			obj.setPosterId(movie.posterId);
			obj.setGenreId(movie.genreId);
			obj.setTitle(movie.title);
			obj.setDescription(movie.description);
			obj.setMinimalAge(movie.minimalAge);
			obj.setIsHighlight(movie.isHighlight === 1);
			obj.setRating(movie.rating);
			obj.setCreatedAt(movie.createdAt);
			obj.setUpdatedAt(movie.updatedAt);
			return obj;
		});
	}
}
