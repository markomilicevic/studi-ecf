import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 500;

export default class GetCinemaRoomIncidentsService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		const { count, rows: incidents } = await this.repository.fetchAndCountAll({ ...query, limit: query.perPage || LIMIT });
		res.setData(incidents);
		res.setPagination({ currentPage: query.currentPage || 1, perPage: query.perPage || LIMIT, itemCount: count });
		return res;
	}
}
