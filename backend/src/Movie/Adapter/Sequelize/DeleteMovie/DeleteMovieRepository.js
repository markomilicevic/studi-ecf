import { Op } from "sequelize";

import MovieModel from "../MovieModel.js";

export default class DeleteMovieRepository {
	async exists({ movieId }) {
		const query = {
			where: {},
		};
		if (movieId) {
			query.where.movieId = { [Op.eq]: movieId };
		}
		return !!(await MovieModel.findOne(query));
	}

	async destroy({ movieId }) {
		await MovieModel.destroy({
			where: {
				movieId: { [Op.eq]: movieId },
			},
		});
		return true;
	}
}
