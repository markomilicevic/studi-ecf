import { Op } from "sequelize";

import CinemaRoomIncidentModel from "../CinemaRoomIncidentModel.js";

export default class DeleteCinemaRoomIncidentRepository {
	async exists({ cinemaRoomIncidentId }) {
		const query = {
			where: { cinemaRoomIncidentId: { [Op.eq]: cinemaRoomIncidentId } },
		};
		return !!(await CinemaRoomIncidentModel.findOne(query));
	}

	async destroy({ cinemaRoomIncidentId }) {
		await CinemaRoomIncidentModel.destroy({
			where: {
				cinemaRoomIncidentId: { [Op.eq]: cinemaRoomIncidentId },
			},
		});
		return true;
	}
}
