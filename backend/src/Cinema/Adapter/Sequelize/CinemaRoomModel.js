import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoomIncidentModel from "./CinemaRoomIncidentModel.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"cinemas_rooms",
		{
			cinemaRoomId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			cinemaId: {
				type: DataTypes.UUID,
			},
			qualityId: {
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

model.hasMany(CinemaRoomIncidentModel, { foreignKey: "cinemaRoomId" });

export default model;
