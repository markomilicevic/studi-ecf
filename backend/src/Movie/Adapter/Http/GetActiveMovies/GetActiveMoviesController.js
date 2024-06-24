export default class GetActiveMoviesController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		return await this.service.execute();
	}
}
