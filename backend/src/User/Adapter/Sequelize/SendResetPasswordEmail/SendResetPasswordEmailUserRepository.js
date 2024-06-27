import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class SendResetPasswordEmailUserRepository {
	async exists({ email }) {
		const query = {
			where: {
				email: { [Op.eq]: email },
			},
		};
		return !!(await UserModel.findOne(query));
	}

	async update({ email, resetPasswordToken }) {
		await UserModel.update(
			{
				resetPasswordToken,
			},
			{
				where: {
					email: { [Op.eq]: email },
				},
			}
		);
		return true;
	}
}
