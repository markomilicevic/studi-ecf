import CinemaRoomIncidentModel from "../CinemaRoomIncidentModel.js";

export default class CreateCinemaRoomIncidentRepository {
	async create({ cinemaRoomIncidentId, cinemaId, cinemaRoomId, incident }) {
		await CinemaRoomIncidentModel.create({
			cinemaRoomIncidentId,
			cinemaId,
			cinemaRoomId,
			incident,
		});
		return true;
	}
}
