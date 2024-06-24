import VerifyBookingController from "./Adapter/Http/VerifyBooking/VerifyBookingController.js";
import BookingValidatorCinemasRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorCinemasRepository.js";
import BookingValidatorPricesRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorPricesRepository.js";
import BookingValidatorSessionRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorSessionRepository.js";
import BookingValidatorSessionReservedPlacementRepository from "./Adapter/Sequelize/BookingValidator/BookingValidatorSessionReservedPlacementRepository.js";
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
};
