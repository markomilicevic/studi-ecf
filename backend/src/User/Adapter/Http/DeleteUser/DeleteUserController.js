export default class DeleteUserController {
	constructor(validator, service) {
		this.validator = validator;
		this.service = service;
	}

	async handle(request) {
		if (!request.userId) {
			throw new Error("Missing userId");
		}
		if (!(await this.validator.exists(request.userId))) {
			throw new Error("Unknown user");
		}
		if (!(await this.validator.hasRole(request.userId, "employee"))) {
			// Only employees can be deleted
			throw new Error("Not the right role");
		}

		return await this.service.execute(request);
	}
}
