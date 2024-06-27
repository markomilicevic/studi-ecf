import GetGenresController from "./Adapter/Http/GetGenres/GetGenresController.js";
import GetGenresService from "./UseCase/GetGenres/GetGenresService.js";
import GetGenresRepository from "./Adapter/Sequelize/GetGenres/GetGenresRepository.js";

export const loadGenreRoutes = (app) => {
	app.get("/api/v1/genres", async (req, res) => {
		try {
			const controller = new GetGenresController(null, new GetGenresService(new GetGenresRepository()));
			const response = await controller.handle();
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
