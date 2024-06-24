export default class Session {
	setSessionId(sessionId) {
		this.sessionId = sessionId;
	}

	setCinemaId(cinemaId) {
		this.cinemaId = cinemaId;
	}

	setMovieId(movieId) {
		this.movieId = movieId;
	}

	setQualityId(qualityId) {
		this.qualityId = qualityId;
	}

	setCinemaRoomId(cinemaRoomId) {
		this.cinemaRoomId = cinemaRoomId;
	}

	setMovie(movie) {
		Object.assign(this, movie);
	}

	setCinema(cinema) {
		Object.assign(this, cinema);
	}

	setCinemaRoom(cinemaRoom) {
		Object.assign(this, cinemaRoom);
	}

	setQuality(quality) {
		Object.assign(this, quality);
	}

	setPrice(price) {
		Object.assign(this, price);
	}

	setStartDate(startDate) {
		this.startDate = startDate;
	}

	setEndDate(endDate) {
		this.endDate = endDate;
	}

	setStandartFreePlaces(standartFreePlaces) {
		this.standartFreePlaces = standartFreePlaces;
	}

	setDisabledFreePlaces(disabledFreePlaces) {
		this.disabledFreePlaces = disabledFreePlaces;
	}

	setSessionReservedPlacement(sessionReservedPlacement) {
		Object.assign(this, sessionReservedPlacement);
	}
}
