import moment from "moment";

export default class GetBookingOrdersController {
	constructor(validator, service) {
		this.service = service;
	}

	async handle(request) {
		if (!request.userId) {
			throw new Error("Missing userId");
		}
		if (request.startDay && !moment(request.startDay)) {
			throw new Error("Invalid startDay");
		}

		return await this.service.execute(request);
	}
}
