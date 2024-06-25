import GetActiveMoviesController from "./Adapter/Http/GetActiveMovies/GetActiveMoviesController.js";
import GetMovieCommentsController from "./Adapter/Http/GetMovieComments/GetMovieCommentsController.js";
import GetMoviesController from "./Adapter/Http/GetMovies/GetMoviesController.js";
import GetActiveMoviesRepository from "./Adapter/Sequelize/GetActiveMovies/GetActiveMoviesRepository.js";
import GetMovieCommentsRepository from "./Adapter/Sequelize/GetMovieComments/GetMovieCommentsRepository.js";
import GetMoviesRepository from "./Adapter/Sequelize/GetMovies/GetMoviesRepository.js";
import GetActiveMoviesService from "./UseCase/GetActiveMovies/GetActiveMoviesService.js";
import GetMovieCommentsService from "./UseCase/GetMovieComments/GetMovieCommentsService.js";
import GetMoviesService from "./UseCase/GetMovies/GetMoviesService.js";

export const loadMovieRoutes = (app) => {
	app.get("/api/v1/movies/actives", async (req, res) => {
		try {
			const controller = new GetActiveMoviesController(null, new GetActiveMoviesService(new GetActiveMoviesRepository()));
			const response = await controller.handle();
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.get("/api/v1/movies", async (req, res) => {
		try {
			const controller = new GetMoviesController(null, new GetMoviesService(new GetMoviesRepository()));
			const response = await controller.handle(req.query);
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.get("/api/v1/movies/:movieId/comments", async (req, res) => {
		try {
			const controller = new GetMovieCommentsController(null, new GetMovieCommentsService(new GetMovieCommentsRepository()));
			const response = await controller.handle({
				...req.query,
				movieId: req.params.movieId,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
