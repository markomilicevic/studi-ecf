import { ElasticSearchFactory } from "../../../../Common/Utils/elasticsearch.js";

export default class GetTicketsRepository {
	async fetch({ startDate, endDate, movieId = null }) {
		let payload = {
			index: "tickets",
			query: {
				bool: {
					must: [
						{
							range: {
								bookedAt: {
									gte: startDate,
									lte: endDate,
								},
							},
						},
					],
				},
			},
			aggs: {
				aggPerMovieId: {
					multi_terms: {
						terms: [
							{
								field: "bookedAt",
							},
							{
								field: "movieId",
							},
						],
					},
				},
			},
			size: 0, // In order to not return matched `hits`
		};
		if (movieId) {
			payload.query.bool.must.push({ match: { movieId } });
		}
		console.log(payload);
		const search = await ElasticSearchFactory.getInstance().getClient().search(payload);

		if (!search?.aggregations?.aggPerMovieId?.buckets?.length) {
			// No tickets sold in that period of time
			return [];
		}

		/*
			Example of `search`:
			```
			{
				"took": 3,
				"timed_out": false,
				"_shards": {
					"total": 1,
					"successful": 1,
					"skipped": 0,
					"failed": 0
				},
				"hits": {
					"total": {
						"value": 5,
						"relation": "eq"
					},
					"max_score": null,
					"hits": []
				},
				"aggregations": {
					"aggPerMovieId": {
						"doc_count_error_upper_bound": 0,
						"sum_other_doc_count": 0,
						"buckets": [{
							"key": ["2024-06-08T00:00:00.000Z", "b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1"],
							"key_as_string": "2024-06-08T00:00:00.000Z|b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1",
							"doc_count": 2
						}, {
							"key": ["2024-06-08T00:00:00.000Z", "b87a3c4e-91f4-415f-9f69-763f3ab71dd9"],
							"key_as_string": "2024-06-08T00:00:00.000Z|b87a3c4e-91f4-415f-9f69-763f3ab71dd9",
							"doc_count": 2
						}, {
							"key": ["2024-06-05T00:00:00.000Z", "b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1"],
							"key_as_string": "2024-06-05T00:00:00.000Z|b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1",
							"doc_count": 1
						}]
					}
				}
			}
			```
		*/

		return search.aggregations.aggPerMovieId.buckets.map((bucket) => ({
			bookedAt: bucket.key[0],
			movieId: bucket.key[1],
			count: bucket.doc_count,
		}));
	}
}
