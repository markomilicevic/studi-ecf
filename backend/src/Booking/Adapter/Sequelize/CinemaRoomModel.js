import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import SessionModel from "./SessionModel.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"cinemas_rooms",
		{
			cinemaRoomid: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			cinemaId: {
				type: DataTypes.STRING,
			},
			roomNumber: {
				type: DataTypes.INTEGER,
			},
			placementsMatrix: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);

model.hasMany(SessionModel, { foreignKey: "cinemaRoomId" });

export default model;
