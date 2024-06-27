import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 500;

export default class GetActiveMoviesService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute(query) {
		const res = new Response();
		res.setData(await this.repository.fetchAll({ limit: LIMIT }));
		return res;
	}
}
