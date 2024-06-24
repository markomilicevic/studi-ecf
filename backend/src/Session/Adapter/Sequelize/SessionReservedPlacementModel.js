import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"sessions_reserved_placements",
		{
			sessionId: {
				type: DataTypes.UUID,
			},
			placementNumber: {
				type: DataTypes.INTEGER,
			},
		},
		{
			paranoid: true,
		}
	);
