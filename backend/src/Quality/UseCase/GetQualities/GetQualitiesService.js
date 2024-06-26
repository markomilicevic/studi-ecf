import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 500;

export default class GetQualitiesService {
	constructor(repository) {
		this.repository = repository;
	}

	async execute() {
		const response = new Response();
		response.setData(await this.repository.fetchAll({ limit: LIMIT }));
		return response;
	}
}
