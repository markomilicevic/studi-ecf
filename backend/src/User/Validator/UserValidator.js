export default class UserValidatorService {
	constructor(repository) {
		this.repository = repository;
	}

	async exists(userId) {
		return await this.repository.exists({ userId });
	}

	async hasRole(userId, role) {
		return await this.repository.exists({ userId, role });
	}
}
