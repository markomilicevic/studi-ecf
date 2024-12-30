import { SequelizeFactory } from "../../../../Common/Utils/sequelize.js";

export default class SignupRepository {
	async exists({ email = null, userName = null }) {
		const whereFieldsEq = [];
		if (email) {
			whereFieldsEq.push({ field: "email", value: email });
		}
		if (userName) {
			whereFieldsEq.push({ field: "userName", value: userName });
		}

		const Sequelize = SequelizeFactory.getInstance().getSequelize();
		// Prepared query trough Sequelize
		const results = await Sequelize.query(
			`SELECT 1 FROM users
			WHERE ${whereFieldsEq.map((where) => `${where.field} = ?`).join(" AND ")}
			`,
			{
				replacements: whereFieldsEq.map((where) => where.value),
				type: Sequelize.QueryTypes.SELECT,
			}
		);
		return results?.length !== 0;
	}

	async create({ userId, email, password, firstName, lastName, userName, role }) {
		const Sequelize = SequelizeFactory.getInstance().getSequelize();
		// Prepared query trough Sequelize
		await Sequelize.query(
			`INSERT INTO users
			(
				userId,
				email,
				password,
				firstName,
				lastName,
				userName,
				role,
				createdAt
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			{
				replacements: [userId, email, password, firstName, lastName, userName, role, new Date()],
				type: Sequelize.QueryTypes.INSERT,
			}
		);
		return true;
	}
}
