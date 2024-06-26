import { Op } from "sequelize";

import BookingModel from "../BookingModel.js";
import SessionModel from "../SessionModel.js";

import BookingOrder from "../../../Business/BookingOrder.js";
import Session from "../../../Business/Session.js";
import User from "../../../Business/User.js";

export default class ReactionsValidatorBookingRepository {
	async fetchOne({ bookingId }) {
		const query = {
			include: [
				{
					model: SessionModel,
					required: true,
				},
			],
			where: {
				bookingId: { [Op.eq]: bookingId },
			},
		};
		const booking = await BookingModel.findOne(query);
		if (!booking) {
			return null;
		}

		const obj = new BookingOrder();
		obj.setBookingId(booking.bookingId);

		const u = new User();
		u.setUserId(booking.userId);
		obj.setUser(u);

		const s = new Session();
		s.setSessionId(booking.sessionId);
		s.setEndDate(booking.session.endDate);
		obj.setSession(s);

		return obj;
	}
}
