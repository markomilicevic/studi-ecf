export default class BookController {
	constructor(validator, service) {
		this.validator = validator;
		this.service = service;
	}

	async handle(request) {
		if (!request.userId) {
			throw new Error("Missing userId");
		}
		if (!request.movieId) {
			throw new Error("Missing movieId");
		}

		// Double-check the reserved placements and final total price
		if (!request.expectedTotalPriceValue) {
			throw new Error("Missing expectedTotalPriceValue");
		}
		if (!request.expectedTotalPriceUnit) {
			throw new Error("Missing expectedTotalPriceUnit");
		}
		const validatorResponse = await this.validator.execute(request);
		if (!validatorResponse.data) {
			// One or several validation issues
			return validatorResponse;
		}

		// Request has been already validated in the validator
		return await this.service.execute(request);
	}
}
