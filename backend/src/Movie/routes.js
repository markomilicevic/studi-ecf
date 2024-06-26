import CreateMovieController from "./Adapter/Http/CreateMovie/CreateMovieController.js";
import DeleteMovieController from "./Adapter/Http/DeleteMovie/DeleteMovieController.js";
import GetActiveMoviesController from "./Adapter/Http/GetActiveMovies/GetActiveMoviesController.js";
import GetMovieCommentsController from "./Adapter/Http/GetMovieComments/GetMovieCommentsController.js";
import GetMoviesController from "./Adapter/Http/GetMovies/GetMoviesController.js";
import UpdateMovieController from "./Adapter/Http/UpdateMovie/UpdateMovieController.js";
import UploadMoviePosterController from "./Adapter/Http/UploadMoviePoster/UploadMoviePosterController.js";
import CreateMovieRepository from "./Adapter/Sequelize/CreateMovie/CreateMovieRepository.js";
import DeleteMovieRepository from "./Adapter/Sequelize/DeleteMovie/DeleteMovieRepository.js";
import GetActiveMoviesRepository from "./Adapter/Sequelize/GetActiveMovies/GetActiveMoviesRepository.js";
import GetMovieCommentsRepository from "./Adapter/Sequelize/GetMovieComments/GetMovieCommentsRepository.js";
import GetMoviesRepository from "./Adapter/Sequelize/GetMovies/GetMoviesRepository.js";
import UpdateMovieRepository from "./Adapter/Sequelize/UpdateMovie/UpdateMovieRepository.js";
import CreateMovieService from "./UseCase/CreateMovie/CreateMovieService.js";
import DeleteMovieService from "./UseCase/DeleteMovie/DeleteMovieService.js";
import GetActiveMoviesService from "./UseCase/GetActiveMovies/GetActiveMoviesService.js";
import GetMovieCommentsService from "./UseCase/GetMovieComments/GetMovieCommentsService.js";
import GetMoviesService from "./UseCase/GetMovies/GetMoviesService.js";
import UpdateMovieService from "./UseCase/UpdateMovie/UpdateMovieService.js";
import UploadMoviePosterService from "./UseCase/UploadMoviePoster/UploadMoviePosterService.js";

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

	app.post("/api/v1/movies/poster", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new UploadMoviePosterController(null, new UploadMoviePosterService());
			const response = await controller.handle(req.files);

			let code = 201; // Created
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
			}

			res.status(code).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.put("/api/v1/movies/:movieId", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new UpdateMovieController(null, new UpdateMovieService(new UpdateMovieRepository()));
			const response = await controller.handle({ ...req.body, movieId: req.params.movieId });

			let code = 204; // No content
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
			}

			res.status(code).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.post("/api/v1/movies", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new CreateMovieController(null, new CreateMovieService(new CreateMovieRepository()));
			const response = await controller.handle(req.body);

			let code = 201; // Created
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
			}

			res.status(code).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.delete("/api/v1/movies/:movieId", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new DeleteMovieController(null, new DeleteMovieService(new DeleteMovieRepository()));
			const response = await controller.handle({ movieId: req.params.movieId });

			let code = 204; // No content
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
			}

			res.status(code).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
