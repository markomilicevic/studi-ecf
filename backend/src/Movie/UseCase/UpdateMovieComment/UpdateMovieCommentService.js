import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import MovieComment from "../../Business/MovieComment.js";

export default class UpdateMovieCommentService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.movieCommentId) {
			errors.push("INVALID_MOVIE_COMMENT_ID");
		}
		if (!(await this.repository.exists({ movieCommentId: query.movieCommentId }))) {
			errors.push("UNKNOWN_MOVIE_COMMENT_ID");
		}
		if (!query.status) {
			errors.push("INVALID_STATUS");
		}
		if (!["approved", "rejected"].includes(query.status)) {
			errors.push("INVALID_STATUS");
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
				await this.repository.update({
					movieCommentId: query.movieCommentId,
					status: query.status,
				});

				const movieComment = new MovieComment();
				movieComment.setMovieCommentId(query.movieCommentId);
				res.setData(movieComment);
			});

		return res;
	}
}
