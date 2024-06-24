import Response from "../../../Common/Utils/Response.js";

export default class GetSessionService {
	constructor(sessionRepository, sessionReservedPlacementRepository) {
		this.sessionRepository = sessionRepository;
		this.sessionReservedPlacementRepository = sessionReservedPlacementRepository;
	}

	async execute(query) {
		return Promise.all([this.sessionRepository.fetchOne(query), this.sessionReservedPlacementRepository.fetchOne(query)]).then((results) => {
			const res = new Response();
			const [session, sessionReservedPlacement] = results;
			session.setSessionReservedPlacement(sessionReservedPlacement);
			res.setData(session);
			return res;
		});
	}
}
