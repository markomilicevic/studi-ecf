import { Op } from "sequelize";

import CinemaRoomModel from "../CinemaRoomModel.js";

export default class DeleteCinemaRoomRepository {
	async exists({ cinemaId, cinemaRoomId }) {
		const query = {
			where: { cinemaId: { [Op.eq]: cinemaId }, cinemaRoomId: { [Op.eq]: cinemaRoomId } },
		};
		return !!(await CinemaRoomModel.findOne(query));
	}

	async destroy({ cinemaId, cinemaRoomId }) {
		await CinemaRoomModel.destroy({
			where: {
				cinemaId: { [Op.eq]: cinemaId },
				cinemaRoomId: { [Op.eq]: cinemaRoomId },
			},
		});
		return true;
	}
}
