import { Op } from "sequelize";

import CinemaRoomIncidentModel from "../CinemaRoomIncidentModel.js";

export default class UpdateCinemaRoomIncidentRepository {
	async exists({ cinemaRoomIncidentId }) {
		const query = {
			where: {
				cinemaRoomIncidentId: { [Op.eq]: cinemaRoomIncidentId },
			},
		};
		return !!(await CinemaRoomIncidentModel.findOne(query));
	}

	async update({ cinemaRoomIncidentId, incident }) {
		await CinemaRoomIncidentModel.update(
			{
				incident,
			},
			{
				where: {
					cinemaRoomIncidentId: { [Op.eq]: cinemaRoomIncidentId },
				},
			}
		);
		return true;
	}
}
