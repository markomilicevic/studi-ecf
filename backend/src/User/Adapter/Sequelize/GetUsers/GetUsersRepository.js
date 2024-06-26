import { Op } from "sequelize";

import User from "../../../Business/User.js";
import UserModel from "../UserModel.js";

export default class SignupRepository {
	async fetchAll({ role = null, limit }) {
		const query = {
			where: {},
			order: [
				["firstName", "ASC"],
				["lastName", "ASC"],
			],
			limit,
		};
		if (role) {
			query.where.role = { [Op.eq]: role };
		}
		const users = await UserModel.findAll(query);

		return users.map((user) => {
			const obj = new User();
			obj.setUserId(user.userId);
			obj.setFirstName(user.firstName);
			obj.setLastName(user.lastName);
			obj.setUserName(user.userName);
			obj.setEmail(user.email);
			obj.setRole(user.role);
			obj.setCreatedAt(user.createdAt);
			obj.setUpdatedAt(user.updatedAt);
			return obj;
		});
	}
}
