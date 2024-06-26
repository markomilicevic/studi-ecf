import Response from "../../../Common/Utils/Response.js";

export default class SignupService {
	constructor(mailerRepository) {
		this.mailerRepository = mailerRepository;
	}

	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.subject?.length) {
			errors.push("INVALID_SUBJECT");
		}
		if (!query.body?.length) {
			errors.push("INVALID_BODY");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		await this.mailerRepository.create({
			...query,
		});

		res.setData({});
		return res;
	}
}
