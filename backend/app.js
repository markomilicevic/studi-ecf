import "./env.js";

import { exec } from "child_process";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";

import { loadAnalyticsRoutes } from "./src/Analytics/routes.js";
import { loadBookingRoutes } from "./src/Booking/routes.js";
import { loadCinemaRoutes } from "./src/Cinema/routes.js";
import { loadGenreRoutes } from "./src/Genre/routes.js";
import { loadMovieRoutes } from "./src/Movie/routes.js";
import { loadQualityRoutes } from "./src/Quality/routes.js";
import { loadSessionRoutes } from "./src/Session/routes.js";
import AuthJwtRepository from "./src/User/Adapter/Jwt/AuthJwtRepository.js";
import GetMeRepository from "./src/User/Adapter/Sequelize/GetMe/GetMeRepository.js";
import { loadUserRoutes } from "./src/User/routes.js";

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
	app.use(cookieParser());
	app.use(
		fileUpload({
			limits: {
				fileSize: 1024 * 1024 * 1024, // Anti DDoS protection (1GB)
			},
			abortOnLimit: true,
			useTempFiles: true,
			tempFileDir: "/tmp/",
		})
	);

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

	// Middleware for current user fetching
	app.use(async function (req, res, next) {
		if (!req.cookies?.token) {
			// No token
			return next();
		}

		const forceSignout = () => {
			// Force signout
			res.clearCookie("token");
			res.status(401).json({ error: true });
			return res.end();
		};

		// Extract payload from token
		const jwtRepository = new AuthJwtRepository();
		const payload = await jwtRepository.fetchOne({ token: req.cookies.token });
		if (!payload || !payload.userId) {
			// Invalid or expired token
			// Return an Unauthorized
			return forceSignout();
		}

		const getMeRespository = new GetMeRepository();
		const me = await getMeRespository.fetchOne({ userId: payload.userId });
		if (!me) {
			// Invalid or deleted user
			// Return an Unauthorized
			return forceSignout();
		}

		req.me = me;
		next();
	});

	app.get("/api/v1/health-check", (req, res) => {
		res.status(200).json({ ok: true });
	});

	app.get("/api/v1/reload", (req, res) => {
		if (!process?.env?.RELOAD_TOKEN?.length || process.env.RELOAD_TOKEN !== req.query.reloadToken) {
			return res.status(401).json({ error: true });
		}
		exec("cd /home/markomilicevicfr/prod/ && git stash && git pull --rebase && git stash apply && sudo reboot", (error, stdout, stderr) => {
			if (error) {
				console.error(`Reload failed: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Stderror: ${stderr}`);
				return;
			}
			console.log(`Stdout: ${stdout}`);
		});
		res.status(200).json({ ok: true });
	});

	loadAnalyticsRoutes(app);
	loadBookingRoutes(app);
	loadCinemaRoutes(app);
	loadGenreRoutes(app);
	loadMovieRoutes(app);
	loadSessionRoutes(app);
	loadUserRoutes(app);
	loadQualityRoutes(app);

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
})();
