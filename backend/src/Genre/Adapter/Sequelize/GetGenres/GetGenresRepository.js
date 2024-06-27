import Genre from "../../../Business/Genre.js";
import GenreModel from "../GenreModel.js";

export default class GetGenresRepository {
	async fetchAll({ limit }) {
		const genres = await GenreModel.findAll({
			order: [["genreName", "ASC"]],
			limit,
		});

		return genres.map((genre) => {
			const obj = new Genre();
			obj.setGenreId(genre.genreId);
			obj.setGenreName(genre.genreName);
			return obj;
		});
	}
}
