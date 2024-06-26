import moment from "moment";

import Response from "../../../Common/Utils/Response.js";

export default class GetTicketsService {
	constructor(ticketsRepository, moviesRepository) {
		this.ticketsRepository = ticketsRepository;
		this.moviesRepository = moviesRepository;
	}

	async execute(query) {
		const res = new Response();

		if (!query.startDate || !moment(query.startDate).isValid()) {
			throw new Error("Invalid startDate");
		}
		if (!query.endDate || !moment(query.endDate).isValid()) {
			throw new Error("Invalid endDate");
		}
		if (moment(query.startDate).isAfter(moment(query.endDate))) {
			throw new Error("startDate must be before endDate");
		}

		let tickets = await this.ticketsRepository.fetch({ startDate: query.startDate, endDate: query.endDate, movieId: query.movieId });
		if (!tickets?.length) {
			// No tickets sold in that period of time
			res.setData([]);
			return res;
		}

		// Fetch all movies titles
		const movieIds = Array.from(new Set(tickets.map((ticket) => ticket.movieId)));
		const movies = await this.moviesRepository.fetchAll({ movieIds });
		if (!movies?.length) {
			throw new Error(`No movie found for movieIds=${JSON.stringify(movieIds)}`);
		}

		// Associate all movies titles
		tickets = tickets.map((ticket) => {
			const movie = movies.find((movie) => movie.movieId === ticket.movieId);
			if (!movie) {
				throw new Error(`No movie found for movieId=${ticket.movieId}`);
			}

			return {
				...ticket,
				movieTitle: movie.title,
			};
		});

		// Return a Google Chart's friendly response

		const data = [];
		const uniqBookedAts = Array.from(new Set(tickets.map((ticket) => ticket.bookedAt)));
		const uniqMovieTitles = Array.from(new Set(movies.map((movie) => movie.title)));

		// Header
		const header = ["date"];
		for (let i = 0; i < uniqMovieTitles.length; i++) {
			header.push(uniqMovieTitles[i]);
		}
		data.push(header);

		// Row
		for (let i = 0; i < uniqBookedAts.length; i++) {
			const bookedAt = uniqBookedAts[i];
			const row = [bookedAt];
			for (let j = 0; j < uniqMovieTitles.length; j++) {
				const movieTitle = uniqMovieTitles[j];
				// The same movieTitle can be used by several movieId
				const count = tickets.reduce((acc, ticket) => {
					if (ticket.bookedAt === bookedAt && ticket.movieTitle === movieTitle) {
						return acc + ticket.count;
					}
					return acc;
				}, 0);
				row.push(count);
			}
			data.push(row);
		}

		res.setData(data);
		return res;
	}
}
