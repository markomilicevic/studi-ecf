import GetGeoJsClosestCinemaRepository from "./Adapter/GeoJs/GetClosestCinema/GetClosestCinemaRepository.js";
import CreateCinemaRoomController from "./Adapter/Http/CreateCinemaRoom/CreateCinemaRoomController.js";
import DeleteCinemaRoomController from "./Adapter/Http/DeleteCinemaRoom/DeleteCinemaRoomController.js";
import GetCinemaRoomsController from "./Adapter/Http/GetCinemaRooms/GetCinemaRoomsController.js";
import GetCinemasController from "./Adapter/Http/GetCinemas/GetCinemasController.js";
import GetClosestCinemaController from "./Adapter/Http/GetClosestCinema/GetClosestCinemaController.js";
import UpdateCinemaRoomController from "./Adapter/Http/UpdateCinemaRoom/UpdateCinemaRoomController.js";
import CreateCinemaRoomRepository from "./Adapter/Sequelize/CreateCinemaRoom/CreateCinemaRoomRepository.js";
import DeleteCinemaRoomRepository from "./Adapter/Sequelize/DeleteCinemaRoom/DeleteCinemaRoomRepository.js";
import GetCinemaRoomsRepository from "./Adapter/Sequelize/GetCinemaRooms/GetCinemaRoomsRepository.js";
import GetCinemasRepository from "./Adapter/Sequelize/GetCinemas/GetCinemasRepository.js";
import GetSequelizeClosestCinemaRepository from "./Adapter/Sequelize/GetClosestCinema/GetClosestCinemaRepository.js";
import UpdateCinemaRoomRepository from "./Adapter/Sequelize/UpdateCinemaRoom/UpdateCinemaRoomRepository.js";
import CreateCinemaRoomService from "./UseCase/CreateCinemaRoom/CreateCinemaRoomService.js";
import DeleteCinemaRoomService from "./UseCase/DeleteCinemaRoom/DeleteCinemaRoomService.js";
import GetCinemaRoomsService from "./UseCase/GetCinemaRooms/GetCinemaRoomsService.js";
import GetCinemasService from "./UseCase/GetCinemas/GetCinemasService.js";
import GetClosestCinemaService from "./UseCase/GetClosestCinema/GetClosestCinemaService.js";
import UpdateCinemaRoomService from "./UseCase/UpdateCinemaRoom/UpdateCinemaRoomService.js";

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

	app.get("/api/v1/cinemas/:cinemaId/rooms", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new GetCinemaRoomsController(null, new GetCinemaRoomsService(new GetCinemaRoomsRepository()));
			const response = await controller.handle({
				cinemaId: req.params.cinemaId,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.get("/api/v1/cinemas/rooms", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new GetCinemaRoomsController(null, new GetCinemaRoomsService(new GetCinemaRoomsRepository()));
			const response = await controller.handle();
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.put("/api/v1/cinemas/:cinemaId/rooms/:cinemaRoomId", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new UpdateCinemaRoomController(null, new UpdateCinemaRoomService(new UpdateCinemaRoomRepository()));
			const response = await controller.handle({ ...req.body, cinemaId: req.params.cinemaId, cinemaRoomId: req.params.cinemaRoomId });

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

	app.post("/api/v1/cinemas/:cinemaId/rooms", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new CreateCinemaRoomController(null, new CreateCinemaRoomService(new CreateCinemaRoomRepository()));
			const response = await controller.handle({ ...req.body, cinemaId: req.params.cinemaId });

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

	app.delete("/api/v1/cinemas/:cinemaId/rooms/:cinemaRoomId", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new DeleteCinemaRoomController(null, new DeleteCinemaRoomService(new DeleteCinemaRoomRepository()));
			const response = await controller.handle({
				cinemaId: req.params.cinemaId,
				cinemaRoomId: req.params.cinemaRoomId,
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
