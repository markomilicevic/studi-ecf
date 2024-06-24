import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define("session", {
		sessionId: {
			primaryKey: true,
			type: DataTypes.UUID,
		},
		cinemaId: {
			type: DataTypes.UUID,
		},
		movieId: {
			type: DataTypes.UUID,
		},
	}, {
		paranoid: true
	});
