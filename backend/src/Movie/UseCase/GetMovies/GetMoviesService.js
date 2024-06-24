import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 500;

export default class GetMoviesService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const response = new Response();
		response.setData(await this.repository.fetchAll({ ...query, limit: LIMIT }));
		return response;
	}
}
