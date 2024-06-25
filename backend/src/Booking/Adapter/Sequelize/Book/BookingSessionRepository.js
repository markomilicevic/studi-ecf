import { Op } from "sequelize";

import Session from "../../../Business/Session.js";
import SessionModel from "../SessionModel.js";

export default class BookingSessionRepository {
	async fetchOne({ sessionId = null }) {
		const query = {
			where: {},
		};
		if (sessionId) {
			query.where.sessionId = { [Op.eq]: sessionId };
		}
		const session = await SessionModel.findOne(query);
		if (!session) {
			return null;
		}

		const obj = new Session();
		obj.setSessionId(session.sessionId);
		obj.setMovieId(session.movieId);

		return obj;
	}
}
