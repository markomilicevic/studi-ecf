import { Client } from "@elastic/elasticsearch";

class ElasticSearchClass {
	/**
	 * This constructor must not be instanciated outside the ElasticSearchFactory
	 * @param {object} Config
	 */
	constructor({ node }) {
		this.client = new Client({
			node,
		});
	}

	getClient() {
		return this.client;
	}
}

export class ElasticSearchFactory {
	static instance = null;

	constructor() {
		throw new Error("This class is a Singleton");
	}

	static getInstance() {
		if (!ElasticSearchFactory.instance) {
			if (!process.env.ELASTICSEARCH_NODE_URL) {
				throw new Error("Missing ELASTICSEARCH_NODE_URL env variable");
			}

			ElasticSearchFactory.instance = new ElasticSearchClass({
				node: process.env.ELASTICSEARCH_NODE_URL,
			});
		}
		return ElasticSearchFactory.instance;
	}
}
