export default class GetMoviesCommentsController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		return await this.service.execute(request);
	}
}
