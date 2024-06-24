import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const SessionReservedPlacementModel = SequelizeFactory.getInstance()
	.getSequelize()
	.define("sessions_reserved_placements", {
		sessionId: {
			// TODO: Remove me in favor of booking.sessionId
			type: DataTypes.UUID,
		},
		bookingId: {
			type: DataTypes.UUID,
		},
		placementNumber: {
			type: DataTypes.INTEGER,
		},
	}, {
		paranoid: true
	});

// No primary key on this table
SessionReservedPlacementModel.removeAttribute("id");

export default SessionReservedPlacementModel;
