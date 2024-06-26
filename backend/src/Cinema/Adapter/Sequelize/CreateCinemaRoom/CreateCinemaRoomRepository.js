import CinemaRoomModel from "../CinemaRoomModel.js";

export default class CreateCinemaRoomRepository {
	async create({ cinemaRoomId, cinemaId, qualityId, roomNumber, placementsMatrix }) {
		await CinemaRoomModel.create({
			cinemaRoomId,
			cinemaId,
			qualityId,
			roomNumber,
			placementsMatrix,
		});
		return true;
	}
}
