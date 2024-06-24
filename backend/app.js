import "./env.js";

import express from "express";
import cors from "cors";

import { loadMovieRoutes } from "./src/Movie/routes.js";

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

	app.get("/api/v1/health-check", (req, res) => {
		res.status(200).json({ ok: true });
	});

	loadMovieRoutes(app);

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
})();