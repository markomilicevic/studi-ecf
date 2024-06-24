import "./env.js";

import express from "express";

(async () => {
	const app = express();
	const port = process.env.SERVER_LISTEN_PORT;

	app.use(express.json());

	app.get("/api/v1/health-check", (req, res) => {
		res.status(200).json({ ok: true });
	});

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
})();
