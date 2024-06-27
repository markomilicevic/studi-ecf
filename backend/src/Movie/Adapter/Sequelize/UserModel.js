import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";
import MovieCommentModel from "./MovieCommentModel.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"user",
		{
			userId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			userName: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);

model.hasMany(MovieCommentModel, { foreignKey: "userId" });

export default model;
