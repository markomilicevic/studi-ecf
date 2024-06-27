import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const MIN_PASSWORD_LENGTH = 8;

export default class InviteService {
	constructor(inviteRepository, inviteEmailRepository) {
		this.inviteRepository = inviteRepository;
		this.inviteEmailRepository = inviteEmailRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.role) {
			errors.push("INVALID_ROLE");
		}
		if (!this.#isValidEmail(query.email)) {
			errors.push("INVALID_EMAIL");
		}
		if (!this.#isValidPassword(query.password)) {
			errors.push("INVALID_PASSWORD");
		}
		if (!query.firstName?.length) {
			errors.push("INVALID_FIRST_NAME");
		}
		if (!query.lastName?.length) {
			errors.push("INVALID_LAST_NAME");
		}
		if (!query.userName?.length) {
			errors.push("INVALID_USER_NAME");
		}

		// Database verifications
		if (await this.#isEmailAlreadyUsed(query.email)) {
			errors.push("EMAIL_ALREADY_USED");
		}
		if (await this.#isUserNameAlreadyUsed(query.userName)) {
			errors.push("USER_NAME_ALREADY_USED");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const userId = crypto.randomUUID();

		const hashedPassword = crypto.createHash("sha256").update(query.password).digest("hex");

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.inviteRepository.create({
					userId,
					email: query.email,
					password: hashedPassword,
					firstName: query.firstName,
					lastName: query.lastName,
					userName: query.userName,
					role: query.role,
				});

				// Sending email is not rollbackable:
				// This must be done at the end in order to achieve database rollback if needed
				await this.inviteEmailRepository.create({
					email: query.email,
					firstName: query.firstName,
					lastName: query.lastName,
				});
			});

		return res;
	}

	#isValidEmail(email) {
		return email && /^.+@.+$/.test(email);
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

	async #isEmailAlreadyUsed(email) {
		return await this.inviteRepository.exists({ email });
	}

	async #isUserNameAlreadyUsed(userName) {
		return await this.inviteRepository.exists({ userName });
	}
}
