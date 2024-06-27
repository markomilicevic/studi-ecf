import crypto from "crypto";
import moment from "moment";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default class BookService {
	constructor(bookingRepository, sessionRepository, sessionReservedPlacementRepository, ticketsRepository) {
		this.bookingRepository = bookingRepository;
		this.sessionRepository = sessionRepository;
		this.sessionReservedPlacementRepository = sessionReservedPlacementRepository;
		this.ticketsRepository = ticketsRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		// IMPORTANT: You must call the BookingValidator before in order to double-check everything
		if (!query.userId) {
			errors.push("INVALID_USER_ID");
		}
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!query.movieId) {
			errors.push("INVALID_MOVIE_ID");
		}
		if (!query.choicedPlaces || !Array.isArray(query.choicedPlaces) || !query.choicedPlaces.length) {
			errors.push("INVALID_CHOICED_PLACES");
		}
		if (!query.expectedTotalPriceValue) {
			errors.push("INVALID_EXPECTED_TOTAL_PRICE_VALUE");
		}
		if (!query.expectedTotalPriceUnit) {
			errors.push("INVALID_EXPECTED_TOTAL_PRICE_UNIT");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const bookingId = crypto.randomUUID();

		const bookedAt = moment().format("YYYY-MM-DD");

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.bookingRepository.create({
					bookingId,
					movieId: query.movieId,
					userId: query.userId,
					sessionId: query.sessionId,
					totalPlacesNumber: query.choicedPlaces.length,
					totalPriceValue: query.expectedTotalPriceValue,
					totalPriceUnit: query.expectedTotalPriceUnit,
				});

				await this.sessionReservedPlacementRepository.bulkCreate(
					query.choicedPlaces
						.sort((a, b) => {
							if (a < b) {
								return -1;
							} else {
								return 1;
							}
						})
						.map((placementNumber) => ({
							sessionId: query.sessionId, // TODO: Remove me in favor of booking.sessionId
							bookingId,
							placementNumber,
						}))
				);

				await this.ticketsRepository.bulkCreate(
					query.choicedPlaces.map((placementNumber) => ({
						ticketId: `${bookingId}_${placementNumber}`,
						bookedAt,
						movieId: query.movieId,
					}))
				);

				res.setData({
					bookingId,
				});
			});

		return res;
	}
}
