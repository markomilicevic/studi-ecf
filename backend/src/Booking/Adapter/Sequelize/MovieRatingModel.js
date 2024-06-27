import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"movies_rating",
		{
			movieRatingId: {
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
