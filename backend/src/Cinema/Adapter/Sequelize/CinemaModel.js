import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import CinemaRoomModel from "./CinemaRoomModel.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"cinema",
		{
			cinemaId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			cinemaName: {
				type: DataTypes.STRING,
			},
			countryCode: {
				type: DataTypes.STRING,
			},
			address: {
				type: DataTypes.STRING,
			},
			phoneNumber: {
				type: DataTypes.STRING,
			},
			openingHours: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);

model.hasMany(CinemaRoomModel, { foreignKey: "cinemaId" });

export default model;
