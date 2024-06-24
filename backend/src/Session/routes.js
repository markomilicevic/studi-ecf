import GetSessionsController from "./Adapter/Http/GetSessions/GetSessionsController.js";
import GetSessionsCinemasRepository from "./Adapter/Sequelize/GetSessions/GetSessionsCinemasRepository.js";
import GetSessionsPricesRepository from "./Adapter/Sequelize/GetSessions/GetSessionsPricesRepository.js";
import GetSessionsRepository from "./Adapter/Sequelize/GetSessions/GetSessionsRepository.js";
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
};
