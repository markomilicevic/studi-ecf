import jwt from "jsonwebtoken";

export default class JwtRepository {
	create({ payload = {}, expireIn = 60 * 24 * 24 * 365 }) {
		if (!process?.env?.BOOKING_ACCESS_JWT_SECRET_KEY) {
			throw new Error("Missing AUTH_JWT_SECRET_KEY env variable");
		}

		return jwt.sign(payload, process.env.BOOKING_ACCESS_JWT_SECRET_KEY, {
			expiresIn: expireIn,
		});
	}

	async fetchOne({ token }) {
		if (!process?.env?.BOOKING_ACCESS_JWT_SECRET_KEY) {
			throw new Error("Missing AUTH_JWT_SECRET_KEY env variable");
		}

		try {
			return await jwt.verify(token, process.env.BOOKING_ACCESS_JWT_SECRET_KEY);
		} catch (err) {
			// Expired or invalid token
			return null;
		}
	}
}
