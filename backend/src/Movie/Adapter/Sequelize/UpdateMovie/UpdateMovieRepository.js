import { Op } from "sequelize";

import MovieModel from "../MovieModel.js";

export default class UpdateMovieRepository {
	async exists({ movieId }) {
		const query = {
			where: {},
		};
		if (movieId) {
			query.where.movieId = { [Op.eq]: movieId };
		}
		return !!(await MovieModel.findOne(query));
	}

	async update({ movieId, posterId, genreId, title, description, minimalAge, isHighlight, rating }) {
		await MovieModel.update(
			{
				posterId,
				genreId,
				title,
				description,
				minimalAge,
				isHighlight,
				rating,
			},
			{
				where: {
					movieId: { [Op.eq]: movieId },
				},
			}
		);
		return true;
	}
}
