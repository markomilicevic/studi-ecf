import Response from "../Common/Utils/Response.js";
import { SequelizeFactory } from "../Common/Utils/sequelize.js";
import GetUsersController from "./Adapter/Http/GetUsers/GetUsersController.js";
import SigninController from "./Adapter/Http/Signin/SigninController.js";
import SignupController from "./Adapter/Http/Signup/SignupController.js";
import UpdateUserController from "./Adapter/Http/UpdateUser/UpdateUserController.js";
import AuthJwtRepository from "./Adapter/Jwt/AuthJwtRepository.js";
import GetUsersRepository from "./Adapter/Sequelize/GetUsers/GetUsersRepository.js";
import SigninRepository from "./Adapter/Sequelize/Signin/SigninRepository.js";
import SignupRepository from "./Adapter/Sequelize/Signup/SignupRepository.js";
import UpdateUserRepository from "./Adapter/Sequelize/UpdateUser/UpdateUserRepository.js";
import UserValidatorRepository from "./Adapter/Sequelize/UserValidator/UserValidatorRepository.js";
import SignupEmailRepository from "./Adapter/Smtp/Signup/SignupEmailRepository.js";
import GetUsersService from "./UseCase/GetUsers/GetUsersService.js";
import SigninService from "./UseCase/Signin/SigninService.js";
import SignupService from "./UseCase/Signup/SignupService.js";
import UpdateUserService from "./UseCase/UpdateUser/UpdateUserService.js";
import UserValidatorService from "./Validator/UserValidator.js";

export const loadUserRoutes = (app) => {
	app.get("/api/v1/users/me", async (req, res) => {
		try {
			if (!req.me) {
				return res.status(401).json({ error: true });
			}
			const response = new Response();
			// Expose only the minimal number of information
			response.setData({
				userName: req.me.userName,
				role: req.me.role,
			});
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.delete("/api/v1/users/auth", async (req, res) => {
		try {
			res.clearCookie("token");

			res.status(200).json({ success: true });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

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

	app.post("/api/v1/users/auth", async (req, res) => {
		try {
			const controller = new SigninController(null, new SigninService(new SigninRepository(), new AuthJwtRepository()));
			const response = await controller.handle(req.body);

			let code = 200; // OK
			let fileredResponse = {
				status: response.status,
			};
			switch (response.status) {
				case "BAD_REQUEST":
					code = 400; // Bad request
					fileredResponse.errors = response.errors;
					break;
				case "UNAUTHORIZED":
					code = 401; // Unauthorized
					fileredResponse.errors = response.errors;
					break;
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

	app.get("/api/v1/users", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "admin") {
				return res.status(401).json({ error: true });
			}

			const controller = new GetUsersController(null, new GetUsersService(new GetUsersRepository()));
			const response = await controller.handle(req.query);
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});

	app.put("/api/v1/users/:userId", async (req, res) => {
		try {
			if (!req.me || req.me.role !== "admin") {
				return res.status(401).json({ error: true });
			}

			const controller = new UpdateUserController(
				new UserValidatorService(new UserValidatorRepository()),
				new UpdateUserService(new UpdateUserRepository())
			);
			const response = await controller.handle(req.body);
			const fileredResponse = {};
			let code = 204; // No content
			if (response.status === "USER_ERRORS") {
				code = 400; // Bad request
				fileredResponse.errors = response.errors;
			}

			res.status(code).json(fileredResponse);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
