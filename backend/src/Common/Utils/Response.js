export default class Response {
	setStatus(status) {
		this.status = status;
	}

	setErrors(errors) {
		this.errors = errors;
	}

	setData(data) {
		this.data = data;
	}

	setPagination({ currentPage, perPage, itemCount }) {
		this.meta = this.meta || {};
		this.meta.pagination = {
			currentPage,
			lastPage: Math.ceil(itemCount / perPage),
			perPage,
			itemCount,
		};
	}
}
