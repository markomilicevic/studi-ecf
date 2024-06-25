import { DataTypes } from "@sequelize/core";

import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default SequelizeFactory.getInstance()
	.getSequelize()
	.define(
		"user",
		{
			userId: {
				primaryKey: true,
				type: DataTypes.UUID,
			},
			email: {
				type: DataTypes.STRING,
			},
			password: {
				type: DataTypes.STRING,
			},
			firstName: {
				type: DataTypes.STRING,
			},
			lastName: {
				type: DataTypes.STRING,
			},
			userName: {
				type: DataTypes.STRING,
			},
			role: {
				type: DataTypes.STRING,
			},
			resetPasswordToken: {
				type: DataTypes.STRING,
			},
		},
		{
			paranoid: true,
		}
	);
