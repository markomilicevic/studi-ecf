import { Op } from "sequelize";

import User from "../../../Business/User.js";
import UserModel from "../UserModel.js";

export default class SigninRepository {
	async fetchOne({ email, password }) {
		const query = {
			where: {
				email: { [Op.eq]: email },
				password: { [Op.eq]: password },
			},
		};
		const user = await UserModel.findOne(query);
		if (!user) {
			return null;
		}

		const obj = new User();
		obj.setUserId(user.userId);
		return obj;
	}
}
