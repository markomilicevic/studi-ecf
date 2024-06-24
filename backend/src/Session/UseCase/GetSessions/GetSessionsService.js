import Response from "../../../Common/Utils/Response.js";
import Price from "../../Business/Price.js";

export const LIMIT = 50;

export default class GetSessionsService {
	constructor(sessionRepository, cinemaRepository, priceRepository) {
		this.sessionRepository = sessionRepository;
		this.cinemaRepository = cinemaRepository;
		this.priceRepository = priceRepository;
	}

	async execute(query) {
		const res = new Response();

		const { count, rows: sessions } = await this.sessionRepository.fetchAndCountAll({ ...query, limit: query.perPage || LIMIT });

		// Fetch cinemas
		const cinemaIds = Array.from(new Set(sessions.map((session) => session.cinemaId)).values());
		const cinemas = await Promise.all(cinemaIds.map((cinemaId) => this.cinemaRepository.fetchOne({ cinemaId })));

		// Fetch prices
		const qualityIdsCountryCodes = Array.from(
			new Set(
				sessions.map((session) => {
					const cinema = cinemas.find((cinema) => cinema.cinemaId === session.cinemaId);
					return `${session.qualityId}_${cinema.countryCode}`;
				})
			).values()
		);
		const prices = await Promise.all(
			qualityIdsCountryCodes.map((qualityIdCountryCode) =>
				this.priceRepository.fetchOne({ qualityId: qualityIdCountryCode.split("_")[0], countryCode: qualityIdCountryCode.split("_")[1] })
			)
		);

		// Associate prices to sessions
		sessions.forEach((session) => {
			const cinema = cinemas.find((cinema) => cinema.cinemaId === session.cinemaId);
			const price = prices.find((price) => price.qualityId === session.qualityId && price.countryCode === cinema.countryCode);
			if (!price) {
				return;
			}

			const p = new Price();
			p.setPriceValue(price.priceValue);
			p.setPriceUnit(price.priceUnit);
			session.setPrice(p);
		});

		res.setData(sessions);
		res.setPagination({ currentPage: query.currentPage || 1, perPage: query.perPage || LIMIT, itemCount: count });

		return res;
	}
}
