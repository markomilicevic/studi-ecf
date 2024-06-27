import crypto from "crypto";

import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoom from "../../Business/CinemaRoom.js";

export default class CreateCinemaRoomService {
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
		if (!query.qualityId) {
			errors.push("INVALID_QUALITY_ID");
		}
		if (!query.roomNumber) {
			errors.push("INVALID_ROOM_NUMBER");
		}
		if (!query.placementsMatrix) {
			errors.push("INVALID_PLACEMENTS_MATRIX");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const cinemaRoomId = crypto.randomUUID();

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.repository.create({
					cinemaRoomId,
					cinemaId: query.cinemaId,
					qualityId: query.qualityId,
					roomNumber: query.roomNumber,
					placementsMatrix: query.placementsMatrix,
				});

				const cinemaRoom = new CinemaRoom();
				cinemaRoom.setCinemaRoomId(cinemaRoomId);
				res.setData(cinemaRoom);
			});

		return res;
	}
}
