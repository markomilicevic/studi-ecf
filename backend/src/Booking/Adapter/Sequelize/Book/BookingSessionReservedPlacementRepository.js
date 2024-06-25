import SessionReservedPlacementModel from "../SessionReservedPlacementModel.js";

export default class BookingSessionReservedPlacementRepository {
	async bulkCreate(sessionReservedPlacements) {
		await SessionReservedPlacementModel.bulkCreate(sessionReservedPlacements);
		return true;
	}
}
