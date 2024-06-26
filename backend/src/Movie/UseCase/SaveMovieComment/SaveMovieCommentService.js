import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import MovieComment from "../../Business/MovieComment.js";

export default class SaveMovieCommentService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!query.movieId) {
			errors.push("INVALID_MOVIE_ID");
		}
		if (!query.userId) {
			errors.push("INVALID_USER_ID");
		}
		if (!query.comment) {
			errors.push("INVALID_COMMENT");
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
				// TODO: Find a way to use Upsert with Sequelize
				if (
					await this.repository.exists({
						sessionId: query.sessionId,
						userId: query.userId,
					})
				) {
					await this.repository.update({
						sessionId: query.sessionId,
						userId: query.userId,
						comment: query.comment,
						status: "created", // Resend to moderation
					});
				} else {
					// It's enough random that duplicates are "near impossible"
					const movieCommentId = crypto.randomUUID();

					await this.repository.create({
						movieCommentId,
						sessionId: query.sessionId,
						movieId: query.movieId,
						userId: query.userId,
						comment: query.comment,
						status: "created", // Must be moderated
					});

					const movieComment = new MovieComment();
					movieComment.setMovieCommentId(movieCommentId);
					res.setData(movieComment);
				}
			});

		return res;
	}
}
