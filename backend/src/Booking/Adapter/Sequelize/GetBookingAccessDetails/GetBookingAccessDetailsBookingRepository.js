import { Op } from "sequelize";

import BookingModel from "../BookingModel.js";
import MovieModel from "../MovieModel.js";
import SessionModel from "../SessionModel.js";

import BookingOrder from "../../../Business/BookingOrder.js";
import Session from "../../../Business/Session.js";
import Movie from "../../../Business/Movie.js";

export default class GetBookingAccessDetailsBookingRepository {
	async fetchOne({ bookingId }) {
		const query = {
			include: [
				{
					model: MovieModel,
					required: true,
					// Continue to fetch orders of soft-deleted movies
					paranoid: false,
				},
				{
					model: SessionModel,
					required: true,
				},
			],
			where: {
				bookingId: { [Op.eq]: bookingId },
			},
		};
		const bookingOrder = await BookingModel.findOne(query);
		if (!bookingOrder) {
			return null;
		}

		const obj = new BookingOrder();
		obj.setBookingId(bookingOrder.bookingId);

		const m = new Movie();
		m.setMovieId(bookingOrder.movie.movieId);
		m.setTitle(bookingOrder.movie.title);
		obj.setMovie(m);

		const s = new Session();
		s.setSessionId(bookingOrder.session.sessionId);
		s.setStartDate(bookingOrder.session.startDate);
		s.setEndDate(bookingOrder.session.endDate);
		obj.setSession(s);

		return obj;
	}
}
