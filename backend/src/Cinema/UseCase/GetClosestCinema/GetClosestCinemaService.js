import Response from "../../../Common/Utils/Response.js";

// Maximal number of cinemas grouped by countries
export const LIMIT = 500;

export default class GetClosestCinemaService {
	constructor(geoJsRepository, cinemasRepository) {
		this.geoJsRepository = geoJsRepository;
		this.cinemasRepository = cinemasRepository;
	}

	async execute({ remoteAddr }) {
		const res = new Response();
		// No suggestion by default
		res.setStatus("NO_SUGGESTION");

		// Execute in parallal to increase response time (will be the slowest of them)
		return Promise.all([this.geoJsRepository.fetch({ remoteAddr }), this.cinemasRepository.fetchAll({ limit: LIMIT })]).then((results) => {
			const [country, cinemas] = results;

			if (cinemas?.some((cinema) => cinema.countryCode === country?.countryCode)) {
				res.setStatus("COUNTRY_SUGGESTED");
				res.setData({ countryCode: country.countryCode });
			}

			return res;
		});
	}
}
