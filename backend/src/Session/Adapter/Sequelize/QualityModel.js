import { DataTypes } from "@sequelize/core";
import SessionModel from "./SessionModel.js";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"qualities",
		{
			qualityId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			qualityName: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);

model.hasMany(SessionModel, { foreignKey: "qualityId" });

export default model;
