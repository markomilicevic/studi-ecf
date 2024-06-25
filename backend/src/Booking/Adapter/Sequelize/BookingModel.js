import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"booking",
		{
			bookingId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			userId: {
				type: DataTypes.UUID,
			},
			sessionId: {
				type: DataTypes.UUID,
			},
			movieId: {
				type: DataTypes.UUID,
			},
			totalPlacesNumber: {
				type: DataTypes.INTEGER,
			},
			totalPriceValue: {
				type: DataTypes.DECIMAL(5, 2),
			},
			totalPriceUnit: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
