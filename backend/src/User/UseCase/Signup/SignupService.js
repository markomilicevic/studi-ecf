import crypto from "crypto";
import moment from "moment";

import Response from "../../../Common/Utils/Response.js";

const MIN_PASSWORD_LENGTH = 8;

export default class SignupService {
	constructor(transactionRepository, signupRepository, jwtRepository, signupEmailRepository) {
		this.transactionRepository = transactionRepository;
		this.signupRepository = signupRepository;
		this.jwtRepository = jwtRepository;
		this.signupEmailRepository = signupEmailRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
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
		await this.transactionRepository.transaction(async () => {
			await this.signupRepository.create({
				userId,
				email: query.email,
				password: hashedPassword,
				firstName: query.firstName,
				lastName: query.lastName,
				userName: query.userName,
				role: "user",
			});

			// Expire in 24 hours
			const expireIn = 24 * 60 * 60;
			const expiration = moment(new Date()).add(expireIn, "seconds");
			const jwtToken = this.jwtRepository.create({
				payload: {
					userId,
				},
				expireIn,
			});

			// Sending email is not rollbackable:
			// This must be done at the end in order to achieve database rollback if needed
			await this.signupEmailRepository.create({
				email: query.email,
				userName: query.userName,
			});

			res.setData({
				tokenValue: jwtToken,
				tokenExpiration: expiration.toISOString(),
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
		return await this.signupRepository.exists({ email });
	}

	async #isUserNameAlreadyUsed(userName) {
		return await this.signupRepository.exists({ userName });
	}
}
