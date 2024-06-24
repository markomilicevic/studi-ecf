import GetCinemasController from "./Adapter/Http/GetCinemas/GetCinemasController.js";
import GetCinemasRepository from "./Adapter/Sequelize/GetCinemas/GetCinemasRepository.js";
import GetCinemasService from "./UseCase/GetCinemas/GetCinemasService.js";

export const loadCinemaRoutes = (app) => {
	app.get("/api/v1/cinemas", async (req, res) => {
		try {
			const controller = new GetCinemasController(null, new GetCinemasService(new GetCinemasRepository()));
			const response = await controller.handle();
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
