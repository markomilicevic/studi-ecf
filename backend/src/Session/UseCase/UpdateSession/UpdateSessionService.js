import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import Session from "../../Business/Session.js";

export default class UpdateSessionService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.sessionId) {
			errors.push("INVALID_SESSION_ID");
		}
		if (!query.cinemaId) {
			errors.push("INVALID_CINEMA_ID");
		}
		if (!query.movieId) {
			errors.push("INVALID_MOVIE_ID");
		}
		if (!query.cinemaRoomId) {
			errors.push("INVALID_CINEMA_ROOM_ID");
		}
		if (!query.qualityId) {
			errors.push("INVALID_QUALITY_ID");
		}
		if (!query.startDate) {
			errors.push("INVALID_START_DATE");
		}
		if (!query.endDate) {
			errors.push("INVALID_END_DATE");
		}
		if (parseInt(query.standartFreePlaces, 10) < 0) {
			errors.push("INVALID_STANDART_FREE_PLACES");
		}
		if (parseInt(query.disabledFreePlaces, 10) < 0) {
			errors.push("INVALID_DISABLED_FREE_PLACES");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.update({
					sessionId: query.sessionId,
					cinemaId: query.cinemaId,
					movieId: query.movieId,
					cinemaRoomId: query.cinemaRoomId,
					qualityId: query.qualityId,
					startDate: query.startDate,
					endDate: query.endDate,
					standartFreePlaces: parseInt(query.standartFreePlaces, 10),
					disabledFreePlaces: parseInt(query.disabledFreePlaces, 10),
				});
				const session = new Session();
				session.setSessionId(query.sessionId);
				res.setData(session);
			});

		return res;
	}
}
