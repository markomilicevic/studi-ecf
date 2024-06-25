import BookingModel from "../BookingModel.js";

export default class BookingRepository {
	async create({ bookingId, userId, sessionId, movieId, totalPlacesNumber, totalPriceValue, totalPriceUnit }) {
		await BookingModel.create({
			bookingId,
			userId,
			sessionId,
			movieId,
			totalPlacesNumber,
			totalPriceValue,
			totalPriceUnit,
		});
		return true;
	}
}
