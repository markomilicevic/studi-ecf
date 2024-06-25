import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

class NodeMailerClass {
	/**
	 * This constructor must not be instanciated outside the NodeMaileFactory
	 * @param {object} Config
	 */
	constructor({ sendGridApiKey }) {
		this.client = nodemailer.createTransport(
			nodemailerSendgrid({
				apiKey: sendGridApiKey,
			})
		);
	}

	getClient() {
		return this.client;
	}
}

export class NodeMailerFactory {
	static instance = null;

	constructor() {
		throw new Error("This class is a Singleton");
	}

	static getInstance() {
		if (!NodeMailerFactory.instance) {
			if (!process.env.SENDGRID_API_KEY) {
				throw new Error("Missing SENDGRID_API_KEY env variable");
			}

			NodeMailerFactory.instance = new NodeMailerClass({
				sendGridApiKey: process.env.SENDGRID_API_KEY,
			});
		}
		return NodeMailerFactory.instance;
	}
}
