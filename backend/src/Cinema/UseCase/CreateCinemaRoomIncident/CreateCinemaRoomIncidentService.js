import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoomIncident from "../../Business/CinemaRoomIncident.js";

export default class CreateCinemaRoomIncidentService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.cinemaId) {
			errors.push("INVALID_CINEMA_ID");
		}
		if (!query.cinemaRoomId) {
			errors.push("INVALID_CINEMA_ROOM_ID");
		}
		if (!query.incident) {
			errors.push("INVALID_INCIDENT");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const cinemaRoomIncidentId = crypto.randomUUID();

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.create({
					cinemaRoomIncidentId,
					cinemaId: query.cinemaId,
					cinemaRoomId: query.cinemaRoomId,
					incident: query.incident,
				});

				const cinemaRoomIncident = new CinemaRoomIncident();
				cinemaRoomIncident.setCinemaRoomIncidentId(cinemaRoomIncidentId);
				res.setData(cinemaRoomIncident);
			});

		return res;
	}
}
