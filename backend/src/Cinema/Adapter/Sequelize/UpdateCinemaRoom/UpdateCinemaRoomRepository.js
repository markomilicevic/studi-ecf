import { Op } from "sequelize";

import CinemaRoomModel from "../CinemaRoomModel.js";

export default class UpdateCinemaRoomRepository {
	async exists({ cinemaRoomId }) {
		const query = {
			where: {
				cinemaRoomId: { [Op.eq]: cinemaRoomId },
			},
		};
		return !!(await CinemaRoomModel.findOne(query));
	}

	async update({ cinemaRoomId, cinemaId, qualityId, roomNumber, placementsMatrix }) {
		await CinemaRoomModel.update(
			{
				cinemaId,
				qualityId,
				roomNumber,
				placementsMatrix,
			},
			{
				where: {
					cinemaRoomId: { [Op.eq]: cinemaRoomId },
				},
			}
		);
		return true;
	}
}
