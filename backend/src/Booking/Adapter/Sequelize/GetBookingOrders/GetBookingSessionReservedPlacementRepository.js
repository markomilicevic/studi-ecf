import { Op } from "sequelize";

import SessionReservedPlacement from "../../../Business/SessionReservedPlacement.js";
import SessionReservedPlacementModel from "../SessionReservedPlacementModel.js";

export default class GetBookingSessionReservedPlacementRepository {
	async fetchOne({ bookingId }) {
		// TODO: Replace with a valid GROUP_CONCAT with Sequelize
		const query = {
			attributes: ["placementNumber"],
			where: {
				bookingId: { [Op.eq]: bookingId },
			},
		};
		const sessionReservedPlacements = await SessionReservedPlacementModel.findAll(query);

		const srp = new SessionReservedPlacement();
		srp.setReservedPlacementNumbers(sessionReservedPlacements.map((sessionReservedPlacement) => parseInt(sessionReservedPlacement.placementNumber, 10)));
		return srp;
	}
}
