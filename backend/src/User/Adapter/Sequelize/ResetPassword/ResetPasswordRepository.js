import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class ResetPasswordRepository {
	async exists({ resetPasswordToken }) {
		const query = {
			where: {
				resetPasswordToken: { [Op.eq]: resetPasswordToken },
			},
		};
		return !!(await UserModel.findOne(query));
	}

	async update({ password, resetPasswordToken }) {
		await UserModel.update(
			{
				password,
				resetPasswordToken: null,
			},
			{
				where: {
					resetPasswordToken: { [Op.eq]: resetPasswordToken },
				},
			}
		);
		return true;
	}
}
