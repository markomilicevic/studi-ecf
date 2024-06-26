import SessionModel from "../SessionModel.js";

export default class CreateSessionRepository {
	async create({ sessionId, cinemaId, movieId, cinemaRoomId, qualityId, startDate, endDate, standartFreePlaces, disabledFreePlaces }) {
		await SessionModel.create({
			sessionId,
			cinemaId,
			movieId,
			cinemaRoomId,
			qualityId,
			startDate,
			endDate,
			standartFreePlaces,
			disabledFreePlaces,
		});
		return true;
	}
}
