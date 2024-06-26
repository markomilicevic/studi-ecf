export default class MovieComment {
	setMovieCommentId(movieCommentId) {
		this.movieCommentId = movieCommentId;
	}

	setSession(session) {
		Object.assign(this, session);
	}

	setStatus(status) {
		this.status = status;
	}

	setComment(comment) {
		this.comment = comment;
	}
}
