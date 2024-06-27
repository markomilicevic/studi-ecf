import crypto from "crypto";
import moment from "moment";

import Response from "../../../Common/Utils/Response.js";

export default class SigninService {
	constructor(signinRepository, jwtRepository) {
		this.signinRepository = signinRepository;
		this.jwtRepository = jwtRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.email?.length) {
			errors.push("INVALID_EMAIL");
		}
		if (!query.password?.length) {
			errors.push("INVALID_PASSWORD");
		}

		if (errors.length) {
			res.setStatus("BAD_REQUEST");
			res.setErrors(errors);
			return res;
		}

		const hashedPassword = crypto.createHash("sha256").update(query.password).digest("hex");

		const user = await this.signinRepository.fetchOne({
			email: query.email,
			password: hashedPassword,
		});
		if (!user) {
			res.setStatus("UNAUTHORIZED");
			res.setErrors(["WRONG_CREDENTIALS"]);
			return res;
		}

		// Expire in 24 hours
		const expireIn = 24 * 60 * 60;
		const expiration = moment(new Date()).add(expireIn, "seconds");
		const jwtToken = this.jwtRepository.create({
			payload: {
				userId: user.userId,
			},
			expireIn,
		});

		res.setData({
			tokenValue: jwtToken,
			tokenExpiration: expiration.toISOString(),
		});
		return res;
	}
}
