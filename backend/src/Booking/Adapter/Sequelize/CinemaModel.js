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
			countryCode: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
