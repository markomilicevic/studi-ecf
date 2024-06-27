import { Op } from "sequelize";

import SessionReservedPlacementModel from "../SessionReservedPlacementModel.js";
import SessionReservedPlacement from "../../../Business/SessionReservedPlacement.js";

export default class GetBookingAccessDetailsSessionReservedPlacementRepository {
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
