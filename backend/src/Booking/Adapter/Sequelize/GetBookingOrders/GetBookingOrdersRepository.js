import moment from "moment";
import { Op } from "sequelize";

import BookingModel from "../BookingModel.js";
import MovieModel from "../MovieModel.js";
import SessionModel from "../SessionModel.js";

import BookingOrder from "../../../Business/BookingOrder.js";
import Movie from "../../../Business/Movie.js";
import Session from "../../../Business/Session.js";

export default class GetBookingOrdersRepository {
	async fetchAndCountAll({ userId, startDay = null, currentPage, limit }) {
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
				userId: { [Op.eq]: userId },
			},
			order: [["createdAt", "DESC"]],
			offset: (currentPage - 1) * limit,
			limit: limit,
		};
		if (startDay) {
			query.include.find((inc) => inc.model === SessionModel).where = {
				startDate: { [Op.gte]: moment(startDay).startOf("day").toISOString() },
			};
		}
		const { count, rows } = await BookingModel.findAndCountAll(query);

		return {
			count,
			rows: rows.map((bookingOrder) => {
				const obj = new BookingOrder();
				obj.setBookingId(bookingOrder.bookingId);
				obj.setBookedAt(bookingOrder.createdAt);
				obj.setTotalPlacesNumber(bookingOrder.totalPlacesNumber);
				obj.setTotalPriceValue(bookingOrder.totalPriceValue);
				obj.setTotalPriceUnit(bookingOrder.totalPriceUnit);

				const m = new Movie();
				m.setMovieId(bookingOrder.movie.movieId);
				m.setTitle(bookingOrder.movie.title);
				m.setPosterId(bookingOrder.movie.posterId);
				obj.setMovie(m);

				const s = new Session();
				s.setSessionId(bookingOrder.session.sessionId);
				s.setStartDate(bookingOrder.session.startDate);
				s.setEndDate(bookingOrder.session.endDate);
				obj.setSession(s);

				return obj;
			}),
		};
	}
}
