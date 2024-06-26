import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 50;

export default class GetMoviesCommentsService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();

		const { count, rows: moviesComments } = await this.repository.fetchAndCountAll({ ...query, limit: query.perPage || LIMIT });

		res.setData(moviesComments);
		res.setPagination({ currentPage: query.currentPage || 1, perPage: query.perPage || LIMIT, itemCount: count });

		return res;
	}
}
