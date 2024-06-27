import Response from "../../../Common/Utils/Response.js";
import { SequelizeFactory } from "../../../Common/Utils/sequelize.js";

export default class SendResetPasswordEmailService {
	constructor(userRepository, mailerRepository) {
		this.userRepository = userRepository;
		this.mailerRepository = mailerRepository;
	}

	async execute(query) {
		const res = new Response();

		// We verify again: don't trust the user's inputs
		if (!this.#isValidEmail(query.email) || !this.#isEmailUsed(query.email)) {
			// Don't inform the possible attacker that the email is not associated to an account
			// Just silently success without sending any email
			res.setData({});
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const resetPasswordToken = crypto.randomUUID();

		// Use managed transactions by Sequelize
		// The transaction will be automatically commited on success or rollbacked on error
		await SequelizeFactory.getInstance()
			.getSequelize()
			.transaction(async () => {
				await this.userRepository.update({
					email: query.email,
					resetPasswordToken,
				});

				// The email must be called at tht end of the transaction because sending email is not rollbackable
				await this.mailerRepository.create({
					email: query.email,
					resetPasswordToken,
				});

				res.setData({});
			});

		return res;
	}

	#isValidEmail(email) {
		return email && /^.+@.+$/.test(email);
	}

	async #isEmailUsed(email) {
		return await this.userRepository.exists({ email });
	}
}
