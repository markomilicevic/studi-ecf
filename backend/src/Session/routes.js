import CreateSessionController from "./Adapter/Http/CreateSession/CreateSessionController.js";
import GetSessionController from "./Adapter/Http/GetSession/GetSessionController.js";
import GetSessionsController from "./Adapter/Http/GetSessions/GetSessionsController.js";
import UpdateSessionController from "./Adapter/Http/UpdateSession/UpdateSessionController.js";
import CreateSessionRepository from "./Adapter/Sequelize/CreateSession/CreateSessionRepository.js";
import GetSessionRepository from "./Adapter/Sequelize/GetSession/GetSessionRepository.js";
import GetSessionReservedPlacementRepository from "./Adapter/Sequelize/GetSession/GetSessionReservedPlacementRepository.js";
import GetSessionsCinemasRepository from "./Adapter/Sequelize/GetSessions/GetSessionsCinemasRepository.js";
import GetSessionsPricesRepository from "./Adapter/Sequelize/GetSessions/GetSessionsPricesRepository.js";
import GetSessionsRepository from "./Adapter/Sequelize/GetSessions/GetSessionsRepository.js";
import UpdateSessionRepository from "./Adapter/Sequelize/UpdateSession/UpdateSessionRepository.js";
import CreateSessionService from "./UseCase/CreateSession/CreateSessionService.js";
import GetSessionService from "./UseCase/GetSession/GetSessionService.js";
import GetSessionsService from "./UseCase/GetSessions/GetSessionsService.js";
import UpdateSessionService from "./UseCase/UpdateSession/UpdateSessionService.js";

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

	app.put("/api/v1/sessions/:sessionId", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new UpdateSessionController(null, new UpdateSessionService(new UpdateSessionRepository()));
			const response = await controller.handle({ ...req.body, sessionId: req.params.sessionId });

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

	app.post("/api/v1/sessions", async (req, res) => {
		try {
			if (!req.me || !["admin", "employee"].includes(req.me.role)) {
				return res.status(401).json({ error: true });
			}

			const controller = new CreateSessionController(null, new CreateSessionService(new CreateSessionRepository()));
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
};
