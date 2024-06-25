import { Op } from "sequelize";

import User from "../../../Business/User.js";
import UserModel from "../UserModel.js";

export default class GetMeRepository {
	async fetchOne({ userId }) {
		const query = {
			where: {
				userId: { [Op.eq]: userId },
			},
		};
		const user = await UserModel.findOne(query);
		if (!user) {
			return null;
		}

		const obj = new User();
		obj.setUserId(user.userId);
		obj.setUserName(user.userName);
		obj.setRole(user.role);
		return obj;
	}
}
