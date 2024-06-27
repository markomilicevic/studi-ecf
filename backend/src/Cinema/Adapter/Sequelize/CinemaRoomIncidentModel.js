import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"cinemas_rooms_incidents",
		{
			cinemaRoomIncidentId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			cinemaRoomId: {
				type: DataTypes.UUID,
			},
			cinemaId: {
				type: DataTypes.UUID,
			},
			incident: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
