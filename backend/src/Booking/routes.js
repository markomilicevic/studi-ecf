import BookingTicketsRepository from "./Adapter/ElasticSearch/Book/BookingTicketsRepository.js";
import BookController from "./Adapter/Http/Book/BookController.js";
import VerifyBookingController from "./Adapter/Http/VerifyBooking/VerifyBookingController.js";
import BookingRepository from "./Adapter/Sequelize/Book/BookingRepository.js";
import BookingSessionRepository from "./Adapter/Sequelize/Book/BookingSessionRepository.js";
import BookingSessionReservedPlacementRepository from "./Adapter/Sequelize/Book/BookingSessionReservedPlacementRepository.js";
import BookingValidatorCinemasRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorCinemasRepository.js";
import BookingValidatorPricesRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorPricesRepository.js";
import BookingValidatorSessionRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorSessionRepository.js";
import BookingValidatorSessionReservedPlacementRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorSessionReservedPlacementRepository.js";
import BookService from "./UseCase/Book/BookService.js";
import BookingValidator from "./Validator/BookingValidator.js";

export const loadBookingRoutes = (app) => {
	app.post("/api/v1/booking/verify", async (req, res) => {
		try {
			const controller = new VerifyBookingController(
				new BookingValidator(
					new BookingValidatorSessionRepository(),
					new BookingValidatorSessionReservedPlacementRepository(),
					new BookingValidatorCinemasRepository(),
					new BookingValidatorPricesRepository()
				),
				null
			);
			const response = await controller.handle({
				sessionId: req.body.sessionId,
				choicedPlaces: req.body.choicedPlaces,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.post("/api/v1/booking", async (req, res) => {
		try {
			if (!req.me) {
				// Must be logged
				return res.status(401).json({ error: true });
			}

			const controller = new BookController(
				new BookingValidator(
					new BookingValidatorSessionRepository(),
					new BookingValidatorSessionReservedPlacementRepository(),
					new BookingValidatorCinemasRepository(),
					new BookingValidatorPricesRepository()
				),
				new BookService(
					new BookingRepository(),
					new BookingSessionRepository(),
					new BookingSessionReservedPlacementRepository(),
					new BookingTicketsRepository()
				)
			);
			const response = await controller.handle({
				userId: req.me.userId,
				sessionId: req.body.sessionId,
				movieId: req.body.movieId,
				choicedPlaces: req.body.choicedPlaces,
				expectedTotalPriceValue: req.body.expectedTotalPriceValue,
				expectedTotalPriceUnit: req.body.expectedTotalPriceUnit,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
