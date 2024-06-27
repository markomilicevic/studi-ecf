import { Op } from "sequelize";

import Cinema from "../../../Business/Cinema.js";
import CinemaRoom from "../../../Business/CinemaRoom.js";
import CinemaRoomIncident from "../../../Business/CinemaRoomIncident.js";
import CinemaModel from "../CinemaModel.js";
import CinemaRoomIncidentModel from "../CinemaRoomIncidentModel.js";
import CinemaRoomModel from "../CinemaRoomModel.js";

export default class GetCinemaRoomsRepository {
	async fetchAndCountAll({ cinemaId = null, cinemaRoomId = null, currentPage, limit }) {
		const query = {
			include: [
				{
					model: CinemaModel,
					required: true,
				},
				{
					model: CinemaRoomModel,
					required: true,
				},
			],
			where: {},
			order: [
				["updatedAt", "DESC"],
				["createdAt", "DESC"],
			],
			offset: (currentPage - 1) * limit,
			limit: limit,
		};
		if (cinemaId) {
			query.where.cinemaId = { [Op.eq]: cinemaId };
		}
		if (cinemaRoomId) {
			query.where.cinemaRoomId = { [Op.eq]: cinemaRoomId };
		}
		const { count, rows } = await CinemaRoomIncidentModel.findAndCountAll(query);

		return {
			count,
			rows: rows.map((incident) => {
				const obj = new CinemaRoomIncident();
				obj.setCinemaRoomIncidentId(incident.cinemaRoomIncidentId);
				obj.setIncident(incident.incident);
				obj.setLastModifiedAt(incident.updatedAt || incident.createdAt);

				const cinemaRoom = new CinemaRoom();
				cinemaRoom.setCinemaRoomId(incident.cinemaRoomId);
				cinemaRoom.setRoomNumber(incident.cinemas_rooms.roomNumber);
				obj.setCinemaRoom(cinemaRoom);

				const cinema = new Cinema();
				cinema.setCinemaId(incident.cinemaId);
				cinema.setCinemaName(incident.cinema.cinemaName);
				obj.setCinema(cinema);

				return obj;
			}),
		};
	}
}
