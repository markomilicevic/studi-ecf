import { Op } from "sequelize";

import Cinema from "../../../Business/Cinema.js";
import CinemaRoom from "../../../Business/CinemaRoom.js";
import Quality from "../../../Business/Quality.js";
import CinemaModel from "../CinemaModel.js";
import CinemaRoomModel from "../CinemaRoomModel.js";
import QualityModel from "../QualityModel.js";

export default class GetCinemaRoomsRepository {
	async fetchAll({ cinemaId = null, limit }) {
		const query = {
			include: [
				{
					model: CinemaModel,
					required: true,
				},
				{
					model: QualityModel,
					required: true,
				},
			],
			where: {},
			order: [["roomNumber", "ASC"]],
			limit,
		};
		if (cinemaId) {
			query.where.cinemaId = { [Op.eq]: cinemaId };
		}
		const cinemaRooms = await CinemaRoomModel.findAll(query);

		return cinemaRooms.map((cinemaRoom) => {
			const obj = new CinemaRoom();
			obj.setCinemaRoomId(cinemaRoom.cinemaRoomId);
			obj.setRoomNumber(cinemaRoom.roomNumber);
			obj.setPlacementsMatrix(cinemaRoom.placementsMatrix);
			obj.setCreatedAt(cinemaRoom.createdAt);
			obj.setUpdatedAt(cinemaRoom.updatedAt);

			const c = new Cinema();
			c.setCinemaId(cinemaRoom.cinema.cinemaId);
			c.setCountryCode(cinemaRoom.cinema.countryCode);
			c.setCinemaName(cinemaRoom.cinema.cinemaName);
			obj.setCinema(c);

			const q = new Quality();
			q.setQualityId(cinemaRoom.qualities.qualityId);
			q.setQualityName(cinemaRoom.qualities.qualityName);
			obj.setCinema(q);

			return obj;
		});
	}
}
