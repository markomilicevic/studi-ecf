export default class SaveMovieCommentController {
	constructor(validator, service) {
		this.validator = validator;
		this.service = service;
	}

	async handle(request) {
		const validatorResponse = await this.validator.execute(request);
		if (!validatorResponse.data) {
			// One or several validation issues
			return validatorResponse;
		}

		// Delegate request validation to the service
		return await this.service.execute(request);
	}
}
