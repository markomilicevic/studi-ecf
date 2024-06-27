export default class GetBookingAccessController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.userId) {
			throw new Error("Missing userId");
		}
		if (!request.bookingId) {
			throw new Error("Missing bookingId");
		}

		return await this.service.execute(request);
	}
}
