export default class MovieRating {
	setMovieRatingId(movieRatingId) {
		this.movieRatingId = movieRatingId;
	}

	setSession(session) {
		Object.assign(this, session);
	}

	setRating(rating) {
		this.rating = rating;
	}
}
