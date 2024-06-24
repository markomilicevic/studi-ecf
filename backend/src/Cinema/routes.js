import GetGeoJsClosestCinemaRepository from "./Adapter/GeoJs/GetClosestCinema/GetClosestCinemaRepository.js";
import GetCinemasController from "./Adapter/Http/GetCinemas/GetCinemasController.js";
import GetClosestCinemaController from "./Adapter/Http/GetClosestCinema/GetClosestCinemaController.js";
import GetCinemasRepository from "./Adapter/Sequelize/GetCinemas/GetCinemasRepository.js";
import GetSequelizeClosestCinemaRepository from "./Adapter/Sequelize/GetClosestCinema/GetClosestCinemaRepository.js";
import GetCinemasService from "./UseCase/GetCinemas/GetCinemasService.js";
import GetClosestCinemaService from "./UseCase/GetClosestCinema/GetClosestCinemaService.js";

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

	app.get("/api/v1/cinemas/closest", async (req, res) => {
		try {
			const controller = new GetClosestCinemaController(
				null,
				new GetClosestCinemaService(new GetGeoJsClosestCinemaRepository(), new GetSequelizeClosestCinemaRepository())
			);
			const response = await controller.handle({
				// IP of the client (Production) or null (localhost)
				remoteAddr: req.headers["x-forwarded-for"] || null,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
