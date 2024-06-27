import Response from "../../../Common/Utils/Response.js";

export default class GetBookingAccessDetails {
	constructor(jwtRepository, bookingRepository, bookingSessionReservedPlacementRepository) {
		this.jwtRepository = jwtRepository;
		this.bookingRepository = bookingRepository;
		this.bookingSessionReservedPlacementRepository = bookingSessionReservedPlacementRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		// IMPORTANT: You must call the BookingValidator before in order to double-check everything
		if (!query.code) {
			res.setStatus("USER_ERRORS");
			res.setErrors("INVALID_CODE");
			return res;
		}

		const payload = await this.jwtRepository.fetchOne({ token: query.code });
		if (!payload || !payload.bookingId) {
			// Invalid or expired token
			res.setStatus("USER_ERRORS");
			res.setErrors("INVALID_CODE");
			return res;
		}

		const bookingOrder = await this.bookingRepository.fetchOne({ bookingId: payload.bookingId });
		if (!bookingOrder) {
			// No order found
			res.setStatus("USER_ERRORS");
			res.setErrors("INVALID_CODE");
			return res;
		}

		const placements = await this.bookingSessionReservedPlacementRepository.fetchOne({ bookingId: payload.bookingId });
		if (!placements) {
			// No placement found
			res.setStatus("USER_ERRORS");
			res.setErrors("INVALID_CODE");
			return res;
		}

		bookingOrder.setReservedPlacementNumbers(placements);

		res.setData(bookingOrder);

		return res;
	}
}
