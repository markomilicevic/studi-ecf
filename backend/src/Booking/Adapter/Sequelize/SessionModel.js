import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"session",
		{
			sessionId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			cinemaId: {
				type: DataTypes.UUID,
			},
			movieId: {
				type: DataTypes.UUID,
			},
			cinemaRoomId: {
				type: DataTypes.UUID,
			},
			qualityId: {
				type: DataTypes.UUID,
			},
			startDate: {
				type: DataTypes.DATE,
			},
			endDate: {
				type: DataTypes.DATE,
			},
			standartFreePlaces: {
				type: DataTypes.INTEGER,
			},
			disabledFreePlaces: {
				type: DataTypes.INTEGER,
			},
		},
		{
			paranoid: true,
		}
	);
