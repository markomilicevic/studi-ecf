import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoom from "../../Business/CinemaRoom.js";

export default class UpdateCinemaRoomService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.cinemaRoomId) {
			errors.push("INVALID_CINEMA_ROOM_ID");
		}
		if (!query.cinemaId) {
			errors.push("INVALID_CINEMA_ID");
		}
		if (!query.qualityId) {
			errors.push("INVALID_QUALITY_ID");
		}
		if (!query.roomNumber) {
			errors.push("INVALID_ROOM_NUMBER");
		}
		if (!query.placementsMatrix) {
			errors.push("INVALID_PLACEMENTS_MATRIX");
		}
		if (!(await this.repository.exists({ cinemaRoomId: query.cinemaRoomId }))) {
			errors.push("UNKNOWN_CINEMA_ROOM_ID");
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
					cinemaRoomId: query.cinemaRoomId,
					cinemaId: query.cinemaId,
					qualityId: query.qualityId,
					roomNumber: query.roomNumber,
					placementsMatrix: query.placementsMatrix,
				});

				const cinemaRoom = new CinemaRoom();
				cinemaRoom.setCinemaRoomId(query.cinemaRoomId);
				res.setData(cinemaRoom);
			});

		return res;
	}
}
