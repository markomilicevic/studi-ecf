export default class GetGenresController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		return await this.service.execute(request);
	}
}
