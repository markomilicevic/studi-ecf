import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
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
			address: {
				type: DataTypes.STRING,
			},
			phoneNumber: {
				type: DataTypes.STRING,
			},
			openingHours: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
