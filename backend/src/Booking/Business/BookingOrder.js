export default class BookingOrder {
	setBookingId(bookingId) {
		this.bookingId = bookingId;
	}

	setTotalPlacesNumber(totalPlacesNumber) {
		this.totalPlacesNumber = totalPlacesNumber;
	}

	setTotalPriceValue(totalPriceValue) {
		this.totalPriceValue = totalPriceValue;
	}

	setTotalPriceUnit(totalPriceUnit) {
		this.totalPriceUnit = totalPriceUnit;
	}

	setBookedAt(bookedAt) {
		this.bookedAt = bookedAt;
	}

	setMovie(movie) {
		Object.assign(this, movie);
	}

	setSession(session) {
		Object.assign(this, session);
	}

	setUser(user) {
		Object.assign(this, user);
	}

	setMovieComment(movieComment) {
		Object.assign(this, movieComment);
	}

	setMovieRating(movieRating) {
		Object.assign(this, movieRating);
	}

	setReservedPlacementNumbers(reservedPlacementNumbers) {
		Object.assign(this, reservedPlacementNumbers);
	}
}
