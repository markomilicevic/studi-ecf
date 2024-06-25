import { SequelizeFactory } from "../Common/Utils/sequelize.js";
import SignupController from "./Adapter/Http/Signup/SignupController.js";
import AuthJwtRepository from "./Adapter/Jwt/AuthJwtRepository.js";
import SignupRepository from "./Adapter/Sequelize/Signup/SignupRepository.js";
import SignupEmailRepository from "./Adapter/Smtp/Signup/SignupEmailRepository.js";
import SignupService from "./UseCase/Signup/SignupService.js";

export const loadUserRoutes = (app) => {
	app.post("/api/v1/users", async (req, res) => {
		try {
			if (req.me) {
				// Already logged
				return res.status(401).json({ error: true });
			}

			const controller = new SignupController(
				null,
				new SignupService(SequelizeFactory.getInstance().getSequelize(), new SignupRepository(), new AuthJwtRepository(), new SignupEmailRepository())
			);
			const response = await controller.handle(req.body);

			let code = 201; // Created
			let fileredResponse = {
				status: response.status,
			};
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
				fileredResponse.errors = response.errors;
			}

			if (response.data?.tokenValue && response.data?.tokenExpiration) {
				res.cookie("token", response.data.tokenValue, {
					secure: !!process.env.NODE_ENV,
					httpOnly: true,
					expires: new Date(response.data.tokenExpiration),
				});
			}

			res.status(code).json(fileredResponse);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
