import moment from "moment";

import Response from "../../Common/Utils/Response.js";

export default class ReactionsValidator {
	constructor(bookingRepository) {
		this.bookingRepository = bookingRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.bookingId) {
			errors.push("INVALID_BOOKING_ID");
		}
		if (!query.userId) {
			errors.push("INVALID_USER_ID");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		const booking = await this.bookingRepository.fetchOne({
			bookingId: query.bookingId,
		});
		if (!booking) {
			// Cannot fetch the booking
			errors.push("INVALID_BOOKING_ID");
		}
		if (booking.userId !== query.userId) {
			// User mismatch on booking
			errors.push("INVALID_USER_ID");
		}
		if (moment(booking.endDate).isAfter(moment(new Date()))) {
			// Session not yet ended
			errors.push("INVALID_MOVIE_ID");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		res.setData({});
		return res;
	}
}
