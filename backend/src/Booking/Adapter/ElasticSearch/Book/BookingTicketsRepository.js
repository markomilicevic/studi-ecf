import { ElasticSearchFactory } from "../../../../Common/Utils/elasticsearch.js";

export default class BookingTicketsRepository {
	async bulkCreate(tickets) {
		const body = [];
		tickets.forEach((ticket) => {
			body.push({ index: { _index: "tickets", _id: ticket.ticketId } });
			body.push({
				bookedAt: ticket.bookedAt,
				movieId: ticket.movieId,
			});
		});

		await ElasticSearchFactory.getInstance().getClient().bulk({
			body,
		});

		return true;
	}
}
