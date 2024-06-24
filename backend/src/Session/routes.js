import GetSessionController from "./Adapter/Http/GetSession/GetSessionController.js";
import GetSessionsController from "./Adapter/Http/GetSessions/GetSessionsController.js";
import GetSessionRepository from "./Adapter/Sequelize/GetSession/GetSessionRepository.js";
import GetSessionReservedPlacementRepository from "./Adapter/Sequelize/GetSession/GetSessionReservedPlacementRepository.js";
import GetSessionsCinemasRepository from "./Adapter/Sequelize/GetSessions/GetSessionsCinemasRepository.js";
import GetSessionsPricesRepository from "./Adapter/Sequelize/GetSessions/GetSessionsPricesRepository.js";
import GetSessionsRepository from "./Adapter/Sequelize/GetSessions/GetSessionsRepository.js";
import GetSessionService from "./UseCase/GetSession/GetSessionService.js";
import GetSessionsService from "./UseCase/GetSessions/GetSessionsService.js";

export const loadSessionRoutes = (app) => {
	app.get("/api/v1/sessions", async (req, res) => {
		try {
			const controller = new GetSessionsController(
				null,
				new GetSessionsService(new GetSessionsRepository(), new GetSessionsCinemasRepository(), new GetSessionsPricesRepository())
			);
			const response = await controller.handle({
				...req.query,
				me: req.me || undefined,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.get("/api/v1/sessions/:sessionId", async (req, res) => {
		try {
			const controller = new GetSessionController(null, new GetSessionService(new GetSessionRepository(), new GetSessionReservedPlacementRepository()));
			const response = await controller.handle({
				sessionId: req.params.sessionId,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
