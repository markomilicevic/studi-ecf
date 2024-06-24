import moment from "moment";
import { Op } from "sequelize";

import { getLastWednesdayOrToday } from "../../../../Common/Utils/dates.js";
import Movie from "../../../Business/Movie.js";
import MovieModel from "../MovieModel.js";

export default class GetActiveMoviesRepository {
	async fetchAll({ limit }) {
		const lastWednesday = getLastWednesdayOrToday(moment());

		const movies = await MovieModel.findAll({
			where: { createdAt: { [Op.between]: [moment(lastWednesday).startOf("day").format(), moment(lastWednesday).endOf("day").format()] } },
			order: [["title", "ASC"]],
			limit,
		});

		return movies.map((movie) => {
			const obj = new Movie();
			obj.setMovieId(movie.movieId);
			obj.setPosterId(movie.posterId);
			obj.setTitle(movie.title);
			obj.setDescription(movie.description);
			obj.setMinimalAge(movie.minimalAge);
			obj.setIsHighlight(movie.isHighlight === 1);
			obj.setRating(movie.rating);
			return obj;
		});
	}
}
