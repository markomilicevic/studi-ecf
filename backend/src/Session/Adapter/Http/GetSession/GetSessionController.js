export default class GetSessionController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.sessionId) {
			throw new Error("missing sessionId");
		}

		return await this.service.execute(request);
	}
}
