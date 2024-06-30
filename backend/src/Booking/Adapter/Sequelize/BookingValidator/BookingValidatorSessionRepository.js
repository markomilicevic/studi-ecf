import { Op } from "sequelize";

import CinemaRoom from "../../../Business/CinemaRoom.js";
import Session from "../../../Business/Session.js";
import CinemaRoomModel from "../CinemaRoomModel.js";
import SessionModel from "../SessionModel.js";

export default class BookingValidatorSessionRepository {
	async fetchOne({ sessionId = null }) {
		const query = {
			include: [
				{
					model: CinemaRoomModel,
					required: true
				},
			],
			where: {},
		};
		if (sessionId) {
			query.where.sessionId = { [Op.eq]: sessionId };
		}
		const session = await SessionModel.findOne(query);
		if (!session) {
			return null;
		}

		const cr = new CinemaRoom();
		cr.setCinemaRoomId(session.cinemaRoomId);
		cr.setRoomNumber(session.cinemas_rooms.roomNumber);
		cr.setPlacementsMatrix(session.cinemas_rooms.placementsMatrix);

		const obj = new Session();
		obj.setSessionId(session.sessionId);
		obj.setQualityId(session.qualityId);
		obj.setCinemaId(session.cinemas_rooms.cinemaId);
		obj.setStartDate(session.startDate);
		obj.setEndDate(session.endDate);
		obj.setCinemaRoom(cr);

		return obj;
	}
}
