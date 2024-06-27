import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import MovieCommentModel from "./MovieCommentModel.js";
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
			posterId: {
				type: DataTypes.UUID,
			},
			genreId: {
				type: DataTypes.UUID,
			},
			title: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
			},
			minimalAge: {
				type: DataTypes.INTEGER,
			},
			isHighlight: {
				type: DataTypes.INTEGER,
			},
			rating: {
				type: DataTypes.INTEGER,
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
model.hasMany(MovieCommentModel, { foreignKey: "movieId" });

export default model;
