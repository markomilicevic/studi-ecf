export default class VerifyBookingController {
	constructor(validator, service) {
		this.validator = validator;
	}

	async handle(request) {
		// Delegate request validation to the validator
		return await this.validator.execute(request);
	}
}
