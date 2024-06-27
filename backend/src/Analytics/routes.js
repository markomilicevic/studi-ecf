import GetTicketsRepository from "./Adapter/ElasticSearch/GetTickets/GetTicketsRepository.js";
import GetTicketsController from "./Adapter/Http/GetTickets/GetTicketsController.js";
import GetTicketsMoviesRepository from "./Adapter/Sequelize/GetTickets/GetMoviesRepository.js";
import GetTicketsService from "./UseCase/GetTickets/GetTicketsService.js";

export const loadAnalyticsRoutes = (app) => {
	app.get("/api/v1/analytics/tickets", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "admin") {
				return res.status(401).json({ error: true });
			}

			const controller = new GetTicketsController(null, new GetTicketsService(new GetTicketsRepository(), new GetTicketsMoviesRepository()));
			const response = await controller.handle(req.query);
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
