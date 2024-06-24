import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import SessionModel from "./SessionModel.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"movie",
		{
			movieId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			title: {
				type: DataTypes.STRING,
			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
		},
		{
			paranoid: true,
		}
	);

model.hasMany(SessionModel, { foreignKey: "movieId" });

export default model;
