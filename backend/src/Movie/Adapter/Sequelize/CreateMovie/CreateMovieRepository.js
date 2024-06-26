import MovieModel from "../MovieModel.js";

export default class CreateMovieRepository {
	async create({ movieId, posterId, genreId, title, description, minimalAge, isHighlight, rating }) {
		await MovieModel.create({
			movieId,
			posterId,
			genreId,
			title,
			description,
			minimalAge,
			isHighlight,
			rating,
		});
		return true;
	}
}
