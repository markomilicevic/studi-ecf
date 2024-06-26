import Response from "../../../Common/Utils/Response.js";

export const LIMIT = 50;

export default class GetBookingOrdersService {
	constructor(bookingRepository, bookingSessionReservedPlacementRepository, movieCommentRepository, movieRatingRepository) {
		this.bookingRepository = bookingRepository;
		(this.bookingSessionReservedPlacementRepository = bookingSessionReservedPlacementRepository), (this.movieCommentRepository = movieCommentRepository);
		this.movieRatingRepository = movieRatingRepository;
	}

	async execute(query) {
		const res = new Response();

		const { count, rows: bookingOrders } = await this.bookingRepository.fetchAndCountAll({ ...query, limit: query.perPage || LIMIT });

		if (bookingOrders?.length) {
			const bookingIds = bookingOrders.map((bookingOrder) => bookingOrder.bookingId);
			const placements = await Promise.all(bookingIds.map((bookingId) => this.bookingSessionReservedPlacementRepository.fetchOne({ bookingId })));
			for (let i = 0; i < bookingOrders.length; i++) {
				bookingOrders[i].setReservedPlacementNumbers(placements[i]);
			}

			const sessionIds = bookingOrders.map((bookingOrder) => bookingOrder.sessionId);

			// Associate movie comments to the booking orders
			const movieComments = await this.movieCommentRepository.fetchAll({
				sessionIds,
				userId: query.userId,
			});
			if (movieComments?.length) {
				bookingOrders.forEach((bookingOrder) => {
					const movieComment = movieComments.find((movieComment) => movieComment.sessionId === bookingOrder.sessionId);
					if (movieComment) {
						// Comment found
						bookingOrder.setMovieComment(movieComment);
					}
				});
			}

			// Associate movie ratings to the booking orders
			const movieRatings = await this.movieRatingRepository.fetchAll({
				sessionIds,
				userId: query.userId,
			});
			if (movieRatings?.length) {
				bookingOrders.forEach((bookingOrder) => {
					const movieRating = movieRatings.find((movieRating) => movieRating.sessionId === bookingOrder.sessionId);
					if (movieRating) {
						// Rating found
						bookingOrder.setMovieRating(movieRating);
					}
				});
			}
		}

		res.setData(bookingOrders);
		res.setPagination({ currentPage: query.currentPage || 1, perPage: query.perPage || LIMIT, itemCount: count });

		return res;
	}
}
