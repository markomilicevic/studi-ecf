export default class GetTicketsController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(query) {
		if (!query.startDate) {
			throw new Error("Missing startDate");
		}
		if (!query.endDate) {
			throw new Error("Missing endDate");
		}

		return await this.service.execute({
			startDate: query.startDate,
			endDate: query.endDate,
			movieId: query.movieId
		});
	}
}
