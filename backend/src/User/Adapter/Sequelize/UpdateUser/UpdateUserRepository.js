import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class UpdateUserRepository {
	async exists({ email = null, userName = null, excludeUserId }) {
		const query = {
			where: {
				userId: { [Op.not]: excludeUserId },
			},
		};
		if (email) {
			query.where.email = { [Op.eq]: email };
		}
		if (userName) {
			query.where.userName = { [Op.eq]: userName };
		}
		return !!(await UserModel.findOne(query));
	}

	async update({ userId, email, password = null, firstName, lastName, userName }) {
		const newAttrs = {
			email,
			firstName,
			lastName,
			userName,
		};
		if (password) {
			newAttrs.password = password;
		}
		await UserModel.update(newAttrs, {
			where: {
				userId: { [Op.eq]: userId },
			},
		});
		return true;
	}
}
