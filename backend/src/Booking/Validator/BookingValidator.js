import moment from 'moment';

import Response from "../../Common/Utils/Response.js";

export default class BookingValidatorService {
	constructor(sessionRepository, sessionReservedPlacementRepository, cinemaRepository, priceRepository) {
		this.sessionRepository = sessionRepository;
		this.sessionReservedPlacementRepository = sessionReservedPlacementRepository;
		this.cinemaRepository = cinemaRepository;
		this.priceRepository = priceRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!query.choicedPlaces) {
			errors.push("INVALID_CHOICED_PLACES");
		}
		if (!Array.isArray(query.choicedPlaces)) {
			// Not an array of choiced places
			errors.push("INVALID_CHOICED_PLACES");
		}
		if (!query.choicedPlaces.length) {
			// No choiced places
			errors.push("INVALID_CHOICED_PLACES");
		}
		if (new Set(query.choicedPlaces).size !== query.choicedPlaces.length) {
			// Cannot have duplicates
			errors.push("INVALID_CHOICED_PLACES");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		return Promise.all([this.sessionRepository.fetchOne(query), this.sessionReservedPlacementRepository.fetchOne(query)]).then(async (results) => {
			const [session, sessionReservedPlacement] = results;

			if (!session) {
				throw new Error("Cannot fetch the session: sessionId=${query.sessionId}`);");
			}
			if (moment(new Date()).isAfter(moment(session.endDate))) {
				res.setStatus("SESSION_ENDED");
				return res;
			}
			if (moment(new Date()).isAfter(moment(session.startDate))) {
				res.setStatus("SESSION_ALREADY_BEGIN");
				return res;
			}

			// Verify that all choiced places are reservable
			if (
				query.choicedPlaces.some(
					(placeNumber) => !this.#isPlacementReservable(session.placementsMatrix, sessionReservedPlacement.reservedPlacementNumbers, placeNumber)
				)
			) {
				res.setStatus("AT_LEAST_ONE_PLACEMENT_NOT_RESERVABLE");
				return res;
			}

			// Fetch the price for one place
			const price = await this.#getOnePlacePrice(session);
			if (!price || !price.priceValue || !price.priceUnit) {
				throw new Error(`Invalid price: sessionId=${query.sessionId}, price=${JSON.stringify(price)}`);
			}

			const totalPriceValue = price.priceValue * query.choicedPlaces.length;
			const totalPriceUnit = price.priceUnit;

			if (query.expectedTotalPriceValue && query.expectedTotalPriceUnit) {
				if (query.expectedTotalPriceValue !== totalPriceValue || query.expectedTotalPriceUnit !== totalPriceUnit) {
					res.setStatus("TOTAL_PRICE_CHANGED");
					return res;
				}
			}

			res.setData({
				totalPriceValue,
				totalPriceUnit,
			});
			return res;
		});
	}

	#isPlacementReservable(placementsMatrix, reservedPlacementNumbers, placeNumber) {
		let isReservable = false;
		let placesCounter = 0;

		placementsMatrix.split("\n").forEach((row) => {
			row.split("").forEach((column) => {
				if (["S", "D"].includes(column)) {
					if (++placesCounter === placeNumber) {
						isReservable = !reservedPlacementNumbers.includes(placeNumber);
					}
				}
			});
		});

		return isReservable;
	}

	async #getOnePlacePrice(session) {
		// Fetch cinemas
		const cinema = await this.cinemaRepository.fetchOne({ cinemaId: session.cinemaId });
		if (!cinema) {
			throw new Error(`Cannot fetch the cinema: cinemaId=${session.cinemaId}`);
		}

		const price = await this.priceRepository.fetchOne({ qualityId: session.qualityId, countryCode: cinema.countryCode });
		if (!price) {
			throw new Error(`Cannot fetch the price: qualityId=${session.qualityId}, countryCode=${cinema.countryCode}`);
		}

		return price;
	}
}
