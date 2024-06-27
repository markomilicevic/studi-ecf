export default class GetMovieCommentsController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.movieId) {
			throw new Error("Missing movieId");
		}

		return await this.service.execute(request);
	}
}
