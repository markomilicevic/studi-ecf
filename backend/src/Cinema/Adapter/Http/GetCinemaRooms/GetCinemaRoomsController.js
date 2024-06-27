export default class GetCinemaRoomsController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		return await this.service.execute(request);
	}
}
