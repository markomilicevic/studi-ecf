export default class InviteController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.role) {
			throw new Error("Missing role");
		}
		if (request.role !== "employee") {
			// Only employees can be invited
			throw new Error("Not the right role");
		}
		// Delegate request validation to the service
		return await this.service.execute(request);
	}
}
