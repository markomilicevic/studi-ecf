import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"prices",
		{
			qualityId: {
				type: DataTypes.UUID,
			},
			countryCode: {
				type: DataTypes.STRING,
			},
			priceValue: {
				type: DataTypes.DECIMAL(5, 2),
			},
			priceUnit: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);

// This table didn't have an `id` primary key
model.removeAttribute("id");

export default model;
