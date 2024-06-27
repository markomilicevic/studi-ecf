import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoomIncident from "../../Business/CinemaRoomIncident.js";

export default class UpdateCinemaRoomIncidentService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.cinemaRoomIncidentId) {
			errors.push("INVALID_CINEMA_ROOM_INCIDENT_ID");
		}
		if (!query.incident) {
			errors.push("INVALID_INCIDENT");
		}
		if (!(await this.repository.exists({ cinemaRoomIncidentId: query.cinemaRoomIncidentId }))) {
			errors.push("UNKNOWN_CINEMA_ROOM_INCIDENT_ID");
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
					cinemaRoomIncidentId: query.cinemaRoomIncidentId,
					incident: query.incident,
				});

				const cinemaRoomIncident = new CinemaRoomIncident();
				cinemaRoomIncident.setCinemaRoomIncidentId(query.cinemaRoomIncidentId);
				res.setData(cinemaRoomIncident);
			});

		return res;
	}
}
