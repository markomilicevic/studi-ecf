import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"genre",
		{
			genreId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			genreName: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
