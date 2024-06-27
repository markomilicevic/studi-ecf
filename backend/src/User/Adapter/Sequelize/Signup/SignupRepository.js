import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class SignupRepository {
	async exists({ email = null, userName = null }) {
		const query = {
			where: {},
		};
		if (email) {
			query.where.email = { [Op.eq]: email };
		}
		if (userName) {
			query.where.userName = { [Op.eq]: userName };
		}
		return !!(await UserModel.findOne(query));
	}

	async create({ userId, email, password, firstName, lastName, userName, role }) {
		await UserModel.create({
			userId,
			email,
			password,
			firstName,
			lastName,
			userName,
			role,
		});
		return true;
	}
}
