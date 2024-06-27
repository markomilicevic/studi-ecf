import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"movies_comment",
		{
			movieCommentId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			movieId: {
				type: DataTypes.UUID,
			},
			sessionId: {
				type: DataTypes.UUID,
			},
			userId: {
				type: DataTypes.UUID,
			},
			status: {
				type: DataTypes.TEXT,
			},
			comment: {
				type: DataTypes.TEXT,
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
