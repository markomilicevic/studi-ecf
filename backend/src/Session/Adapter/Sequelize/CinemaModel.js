import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import SessionModel from "./SessionModel.js";

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
		},
		{
			paranoid: true,
		}
	);

model.hasMany(SessionModel, { foreignKey: "cinemaId" });

export default model;
