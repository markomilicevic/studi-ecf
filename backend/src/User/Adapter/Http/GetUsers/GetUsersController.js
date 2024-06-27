export default class GetUsersController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (request.role && request.role !== "employee") {
			// Only employees can be fetched
			throw new Error("Invalid role");
		}

		return await this.service.execute(request);
	}
}
