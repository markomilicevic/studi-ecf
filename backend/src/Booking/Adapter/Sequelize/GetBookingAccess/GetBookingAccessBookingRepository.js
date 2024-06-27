import { Op } from "sequelize";

import BookingModel from "../BookingModel.js";

export default class GetBookingAccessBookingRepository {
	async exists({ bookingId, userId }) {
		const query = {
			where: {
				bookingId: { [Op.eq]: bookingId },
				userId: { [Op.eq]: userId },
			},
		};
		return !!(await BookingModel.findOne(query));
	}
}
