import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class DeleteUserRepository {
	async destroy({ userId }) {
		await UserModel.destroy({
			where: {
				userId: { [Op.eq]: userId },
			},
		});
		return true;
	}
}
