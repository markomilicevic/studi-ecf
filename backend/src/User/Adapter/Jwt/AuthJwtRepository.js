import jwt from "jsonwebtoken";

export default class AuthJwtRepository {
	create({ payload = {}, expireIn = 60 * 24 * 24 }) {
		if (!process?.env?.AUTH_JWT_SECRET_KEY) {
			throw new Error("Missing AUTH_JWT_SECRET_KEY env variable");
		}

		return jwt.sign(payload, process.env.AUTH_JWT_SECRET_KEY, {
			expiresIn: expireIn,
		});
	}

	async fetchOne({ token }) {
		if (!process?.env?.AUTH_JWT_SECRET_KEY) {
			throw new Error("Missing AUTH_JWT_SECRET_KEY env variable");
		}

		try {
			return await jwt.verify(token, process.env.AUTH_JWT_SECRET_KEY);
		} catch (err) {
			// Expired or invalid token
			return null;
		}
	}
}
