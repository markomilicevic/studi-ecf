import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import BookingModel from "./BookingModel.js";

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
			posterId: {
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

model.hasMany(BookingModel, { foreignKey: "movieId" });

export default model;
