import { Op } from "sequelize";

import MovieModel from "../MovieModel.js";

export default class SaveMovieRatingMovieRepository {
	async update({ movieId, rating }) {
		await MovieModel.update(
			{
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
