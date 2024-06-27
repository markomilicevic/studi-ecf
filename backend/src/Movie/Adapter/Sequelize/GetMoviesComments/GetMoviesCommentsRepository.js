import Movie from "../../../Business/Movie.js";
import MovieComment from "../../../Business/MovieComment.js";
import User from "../../../Business/User.js";
import MovieCommentModel from "../MovieCommentModel.js";
import MovieModel from "../MovieModel.js";
import UserModel from "../UserModel.js";

export default class GetMoviesCommentsRepository {
	async fetchAndCountAll({ currentPage, limit }) {
		const query = {
			include: [
				{
					model: MovieModel,
					required: true,
				},
				{
					model: UserModel,
					required: true,
				},
			],
			where: {},
			order: [["createdAt", "DESC"]],
			offset: (currentPage - 1) * limit,
			limit: limit,
		};
		const { count, rows } = await MovieCommentModel.findAndCountAll(query);

		return {
			count,
			rows: rows.map((movieComment) => {
				const obj = new MovieComment();
				obj.setMovieCommentId(movieComment.movieCommentId);
				obj.setStatus(movieComment.status);
				obj.setComment(movieComment.comment);
				obj.setCreatedAt(movieComment.createdAt);
				obj.setUpdatedAt(movieComment.updatedAt);

				const m = new Movie();
				m.setMovieId(movieComment.movie.movieId);
				m.setTitle(movieComment.movie.title);
				obj.setMovie(m);

				const u = new User();
				u.setUserId(movieComment.user.userId);
				u.setUserName(movieComment.user.userName);
				obj.setUser(u);

				return obj;
			}),
		};
	}
}
