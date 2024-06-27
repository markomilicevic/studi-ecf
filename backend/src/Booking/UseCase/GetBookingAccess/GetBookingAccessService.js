import Response from "../../../Common/Utils/Response.js";

export default class GetBookingAccessService {
	constructor(bookingRepository, jwtRepository) {
		this.bookingRepository = bookingRepository;
		this.jwtRepository = jwtRepository;
	}

	async execute(query) {
		const res = new Response();

		if (!process?.env?.WEBSITE_BASE_URL) {
			throw new Error("Missing WEBSITE_BASE_URL env variable");
		}

		if (!this.bookingRepository.exists({ bookingId: query.bookingId, userId: query.userId })) {
			throw new Error(`Cannot found booking with bookingId: ${query.bookingId}, userId: ${query.userId}`);
		}

		const jwtToken = this.jwtRepository.create({
			payload: {
				bookingId: query.bookingId,
			},
		});

		res.setData({
			code: `${process.env.WEBSITE_BASE_URL}/access/${encodeURIComponent(jwtToken)}`,
		});

		return res;
	}
}
