import { DataTypes } from "@sequelize/core";
import CinemaRoomModel from "./CinemaRoomModel.js";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

const model = SequelizeFactory.getInstance()
	.getSequelize()
	.define("qualities", {
		qualityId: {
			primaryKey: true,
			type: DataTypes.UUID,
		},
		qualityName: {
			type: DataTypes.STRING,
		},
	}, {
		paranoid: true
	});

model.hasMany(CinemaRoomModel, { foreignKey: "qualityId" });

export default model;
