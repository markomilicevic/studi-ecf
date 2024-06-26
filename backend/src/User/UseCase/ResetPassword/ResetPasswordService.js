import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const MIN_PASSWORD_LENGTH = 8;

export default class ResetPasswordService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.resetPasswordToken) {
			errors.push("INVALID_RESET_PASSWORD_TOKEN");
		}
		if (!(await this.#isValidResetPasswordToken(query.resetPasswordToken))) {
			errors.push("INVALID_RESET_PASSWORD_TOKEN");
		}
		if (!this.#isValidPassword(query.password)) {
			errors.push("INVALID_PASSWORD");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		const hashedPassword = crypto.createHash("sha256").update(query.password).digest("hex");

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.update({
					resetPasswordToken: query.resetPasswordToken,
					password: hashedPassword,
				});

				res.setData({});
			});

		return res;
	}

	async #isValidResetPasswordToken(resetPasswordToken) {
		return await this.repository.exists({ resetPasswordToken });
	}

	#isValidPassword(password) {
		// Min 8 characters including at least:
		// - One lower case
		// - One upper case
		// - One special
		// - One digit
		return (
			password &&
			password.length >= MIN_PASSWORD_LENGTH &&
			/[A-Z]+/.test(password) &&
			/[a-z]+/.test(password) &&
			/[a-z]+/.test(password) &&
			/\W+/.test(password) &&
			/[0-9]+/.test(password)
		);
	}
}
