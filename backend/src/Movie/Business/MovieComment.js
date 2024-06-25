export default class MovieComment {
	setMovieCommentId(movieCommentId) {
		this.movieCommentId = movieCommentId;
	}

	setMovie(movie) {
		Object.assign(this, movie);
	}

	setUser(user) {
		Object.assign(this, user);
	}

	setStatus(status) {
		this.status = status;
	}

	setComment(comment) {
		this.comment = comment;
	}

	setCreatedAt(createdAt) {
		this.createdAt = createdAt
	}

	setUpdatedAt(updatedAt) {
		this.updatedAt = updatedAt;
	}
}
