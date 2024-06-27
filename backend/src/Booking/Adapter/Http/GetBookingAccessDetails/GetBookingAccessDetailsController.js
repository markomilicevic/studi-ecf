export default class GetBookingAccessDetailsController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		// Request has been already validated in the validator
		return await this.service.execute(request);
	}
}
