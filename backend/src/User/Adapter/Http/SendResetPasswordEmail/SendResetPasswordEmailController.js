export default class SendResetPasswordEmailController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.email) {
			throw new Error("Missing email");
		}

		return await this.service.execute(request);
	}
}
