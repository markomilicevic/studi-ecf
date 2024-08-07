import ReactionsValidatorBookingRepository from "../Booking/Adapter/Sequelize/ReactionsValidator/ReactionsValidatorBookingRepository.js";
import ReactionsValidatorService from "../Booking/Validator/ReactionsValidator.js";
import CreateMovieController from "./Adapter/Http/CreateMovie/CreateMovieController.js";
import DeleteMovieController from "./Adapter/Http/DeleteMovie/DeleteMovieController.js";
import GetActiveMoviesController from "./Adapter/Http/GetActiveMovies/GetActiveMoviesController.js";
import GetMovieCommentsController from "./Adapter/Http/GetMovieComments/GetMovieCommentsController.js";
import GetMoviesController from "./Adapter/Http/GetMovies/GetMoviesController.js";
import GetMoviesCommentsController from "./Adapter/Http/GetMoviesComments/GetMoviesCommentsController.js";
import SaveMovieCommentController from "./Adapter/Http/SaveMovieComment/SaveMovieCommentController.js";
import SaveMovieRatingController from "./Adapter/Http/SaveMovieRating/SaveMovieRatingController.js";
import UpdateMovieController from "./Adapter/Http/UpdateMovie/UpdateMovieController.js";
import UpdateMovieCommentController from "./Adapter/Http/UpdateMovieComment/UpdateMovieCommentController.js";
import UploadMoviePosterController from "./Adapter/Http/UploadMoviePoster/UploadMoviePosterController.js";
import CreateMovieRepository from "./Adapter/Sequelize/CreateMovie/CreateMovieRepository.js";
import DeleteMovieRepository from "./Adapter/Sequelize/DeleteMovie/DeleteMovieRepository.js";
import GetActiveMoviesRepository from "./Adapter/Sequelize/GetActiveMovies/GetActiveMoviesRepository.js";
import GetMovieCommentsRepository from "./Adapter/Sequelize/GetMovieComments/GetMovieCommentsRepository.js";
import GetMoviesRepository from "./Adapter/Sequelize/GetMovies/GetMoviesRepository.js";
import GetMoviesCommentsRepository from "./Adapter/Sequelize/GetMoviesComments/GetMoviesCommentsRepository.js";
import SaveMovieCommentRepository from "./Adapter/Sequelize/SaveMovieComment/SaveMovieCommentRepository.js";
import SaveMovieRatingMovieRepository from "./Adapter/Sequelize/SaveMovieRating/SaveMovieRatingMovieRepository.js";
import SaveMovieRatingRepository from "./Adapter/Sequelize/SaveMovieRating/SaveMovieRatingRepository.js";
import UpdateMovieRepository from "./Adapter/Sequelize/UpdateMovie/UpdateMovieRepository.js";
import UpdateMovieCommentRepository from "./Adapter/Sequelize/UpdateMovieComment/UpdateMovieCommentRepository.js";
import CreateMovieService from "./UseCase/CreateMovie/CreateMovieService.js";
import DeleteMovieService from "./UseCase/DeleteMovie/DeleteMovieService.js";
import GetActiveMoviesService from "./UseCase/GetActiveMovies/GetActiveMoviesService.js";
import GetMovieCommentsService from "./UseCase/GetMovieComments/GetMovieCommentsService.js";
import GetMoviesService from "./UseCase/GetMovies/GetMoviesService.js";
import GetMoviesCommentsService from "./UseCase/GetMoviesComments/GetMoviesCommentsService.js";
import SaveMovieCommentService from "./UseCase/SaveMovieComment/SaveMovieCommentService.js";
import SaveMovieRatingService from "./UseCase/SaveMovieRating/SaveMovieRatingService.js";
import UpdateMovieService from "./UseCase/UpdateMovie/UpdateMovieService.js";
import UpdateMovieCommentService from "./UseCase/UpdateMovieComment/UpdateMovieCommentService.js";
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

	app.get("/api/v1/movies/comments", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "employee") {
				return res.status(401).json({ error: true });
			}

			const controller = new GetMoviesCommentsController(null, new GetMoviesCommentsService(new GetMoviesCommentsRepository()));
			const response = await controller.handle(req.query);
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.put("/api/v1/movies/comments/:movieCommentId", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "employee") {
				return res.status(401).json({ error: true });
			}

			const controller = new UpdateMovieCommentController(null, new UpdateMovieCommentService(new UpdateMovieCommentRepository()));
			const response = await controller.handle({
				...req.body,
				movieCommentId: req.params.movieCommentId,
			});

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

	app.put("/api/v1/movies/:movieId/ratings", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "user") {
				return res.status(401).json({ error: true });
			}

			const controller = new SaveMovieRatingController(
				new ReactionsValidatorService(new ReactionsValidatorBookingRepository()),
				new SaveMovieRatingService(new SaveMovieRatingRepository(), new SaveMovieRatingMovieRepository())
			);
			const response = await controller.handle({
				...req.body,
				movieId: req.params.movieId,
				userId: req.me.userId,
			});

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

	app.put("/api/v1/movies/:movieId/comments", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "user") {
				return res.status(401).json({ error: true });
			}

			const controller = new SaveMovieCommentController(
				new ReactionsValidatorService(new ReactionsValidatorBookingRepository()),
				new SaveMovieCommentService(new SaveMovieCommentRepository())
			);
			const response = await controller.handle({
				...req.body,
				movieId: req.params.movieId,
				userId: req.me.userId,
			});

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
