export default class GetQualitiesController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		return await this.service.execute(request);
	}
}
