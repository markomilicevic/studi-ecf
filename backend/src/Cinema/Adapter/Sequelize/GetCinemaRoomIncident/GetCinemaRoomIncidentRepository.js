import { Op } from "sequelize";

import CinemaRoomIncident from "../../../Business/CinemaRoomIncident.js";
import CinemaRoomIncidentModel from "../CinemaRoomIncidentModel.js";

export default class GetCinemaRoomIncidentRepository {
	async fetchOne({ cinemaRoomId }) {
		const query = {
			where: {
				cinemaRoomId: { [Op.eq]: cinemaRoomId },
			},
		};
		const incident = await CinemaRoomIncidentModel.findOne(query);
		if (!incident) {
			return null;
		}

		const obj = new CinemaRoomIncident();
		obj.setCinemaRoomIncidentId(incident.cinemaRoomIncidentId);
		return obj;
	}
}
