import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"quality",
		{
			qualityId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			qualityName: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
