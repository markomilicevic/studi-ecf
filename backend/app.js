import "./env.js";

import cors from "cors";
import express from "express";

import { loadBookingRoutes } from "./src/Booking/routes.js";
import { loadCinemaRoutes } from "./src/Cinema/routes.js";
import { loadGenreRoutes } from "./src/Genre/routes.js";
import { loadMovieRoutes } from "./src/Movie/routes.js";
import { loadSessionRoutes } from "./src/Session/routes.js";

(async () => {
	const app = express();
	const port = process.env.SERVER_LISTEN_PORT;

	app.use(
		cors({
			origin: [process.env.CLIENTS_BASE_URLS.split(",")],
			credentials: true,
		})
	);
	app.use(express.json());

	// Middleware to check common params
	app.use((req, res, next) => {
		// Pagination
		if (req.query.currentPage) {
			req.query.currentPage = Math.max(parseInt(req.query.currentPage, 10), 1);
		}
		if (req.query.perPage) {
			req.query.perPage = Math.max(parseInt(req.query.perPage, 10), 1);
		}

		return next();
	});

	app.get("/api/v1/health-check", (req, res) => {
		res.status(200).json({ ok: true });
	});

	loadBookingRoutes(app);
	loadCinemaRoutes(app);
	loadGenreRoutes(app);
	loadMovieRoutes(app);
	loadSessionRoutes(app);

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
})();
