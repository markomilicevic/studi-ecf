import { Sequelize } from "@sequelize/core";

class SequelizeClass {
	/**
	 * This constructor must not be instanciated outside the SequelizeFactory
	 * @param {object} Database config and crendentials
	 */
	constructor({ host, dialect, database, user, password }) {
		this.sequelize = new Sequelize(database, user, password, {
			host,
			dialect,
		});
	}

	getSequelize() {
		return this.sequelize;
	}
}

export class SequelizeFactory {
	static instance = null;

	constructor() {
		throw new Error("This class is a Singleton");
	}

	static getInstance() {
		if (!SequelizeFactory.instance) {
			if (!process.env.SEQUELIZE_DATABASE_DIALECT) {
				throw new Error("Missing SEQUELIZE_DATABASE_DIALECT env variable");
			}
			if (!process.env.SEQUELIZE_DATABASE_HOST) {
				throw new Error("Missing SEQUELIZE_DATABASE_HOST env variable");
			}
			if (!process.env.SEQUELIZE_DATABASE_DB) {
				throw new Error("Missing SEQUELIZE_DATABASE_DB env variable");
			}
			if (!process.env.SEQUELIZE_DATABASE_DB) {
				throw new Error("Missing SEQUELIZE_DATABASE_DB env variable");
			}
			if (!process.env.SEQUELIZE_DATABASE_USER) {
				throw new Error("Missing SEQUELIZE_DATABASE_USER env variable");
			}
			if (!process.env.SEQUELIZE_DATABASE_PASSWORD) {
				throw new Error("Missing SEQUELIZE_DATABASE_PASSWORD env variable");
			}

			SequelizeFactory.instance = new SequelizeClass({
				dialect: process.env.SEQUELIZE_DATABASE_DIALECT,
				host: process.env.SEQUELIZE_DATABASE_HOST,
				database: process.env.SEQUELIZE_DATABASE_DB,
				user: process.env.SEQUELIZE_DATABASE_USER,
				password: process.env.SEQUELIZE_DATABASE_PASSWORD,
			});
		}
		return SequelizeFactory.instance;
	}
}
