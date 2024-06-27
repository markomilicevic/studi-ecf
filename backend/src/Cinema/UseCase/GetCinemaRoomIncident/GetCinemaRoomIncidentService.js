import Response from "../../../Common/Utils/Response.js";

export default class GetCinemaRoomIncidentService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.cinemaRoomId) {
			errors.push("INVALID_CINEMA_ROOM_ID");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		const res = new Response();
		const incident = await this.repository.fetchOne({ cinemaRoomId: query.cinemaRoomId });
		// Potentially null if not exists
		res.setData(incident);
		return res;
	}
}
