import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
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
