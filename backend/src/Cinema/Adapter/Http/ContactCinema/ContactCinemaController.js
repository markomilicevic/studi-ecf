export default class ContactCinemaController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		// Delegate request validation to the service
		return await this.service.execute(request);
	}
}
