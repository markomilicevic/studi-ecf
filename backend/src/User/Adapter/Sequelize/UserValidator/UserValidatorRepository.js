import { Op } from "sequelize";

import UserModel from "../UserModel.js";

export default class UserValidatorRepository {
	async exists({ userId, role = null }) {
		const query = {
			where: { userId: { [Op.eq]: userId } },
		};
		if (role) {
			query.where.role = { [Op.eq]: role };
		}
		return !!(await UserModel.findOne(query));
	}
}
