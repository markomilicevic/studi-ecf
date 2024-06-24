import { Op } from "sequelize";

import Cinema from "../../../Business/Cinema.js";
import CinemaRoom from "../../../Business/CinemaRoom.js";
import Movie from "../../../Business/Movie.js";
import Quality from "../../../Business/Quality.js";
import Session from "../../../Business/Session.js";
import CinemaModel from "../CinemaModel.js";
import CinemaRoomModel from "../CinemaRoomModel.js";
import MovieModel from "../MovieModel.js";
import QualityModel from "../QualityModel.js";
import SessionModel from "../SessionModel.js";

export default class GetSessionsRepository {
	async fetchAndCountAll({
		countryCode = null,
		cinemaId = null,
		movieId = null,
		standartPlacesNumber = null,
		disabledPlacesNumber = null,
		currentPage,
		limit,
	}) {
		const query = {
			include: [
				{
					model: CinemaModel,
					required: true,
				},
				{
					model: CinemaRoomModel,
					required: true,
				},
				{
					model: QualityModel,
					required: true,
				},
				{
					model: MovieModel,
					required: true,
				},
			],
			where: {},
			order: [["startDate", "ASC"]],
			offset: (currentPage - 1) * limit,
			limit: limit,
		};
		query.where.startDate = { [Op.gt]: new Date() };
		if (countryCode) {
			const cinemaModel = query.include.find((inc) => inc.model === CinemaModel);
			if (cinemaModel) {
				cinemaModel.where = {
					countryCode: { [Op.eq]: countryCode },
				};
			}
		}
		if (cinemaId) {
			query.where.cinemaId = { [Op.eq]: cinemaId };
		}
		if (movieId) {
			query.where.movieId = { [Op.eq]: movieId };
		}
		if (standartPlacesNumber) {
			query.where.standartFreePlaces = { [Op.gte]: standartPlacesNumber };
		}
		if (disabledPlacesNumber) {
			query.where.disabledFreePlaces = { [Op.gte]: disabledPlacesNumber };
		}
		const { count, rows } = await SessionModel.findAndCountAll(query);

		return {
			count,
			rows: rows.map((session) => {
				const obj = new Session();
				obj.setSessionId(session.sessionId);
				obj.setCinemaId(session.cinemaId);
				obj.setMovieId(session.movieId);
				obj.setQualityId(session.qualityId);
				obj.setCinemaRoomId(session.cinemaRoomId);

				const c = new Cinema();
				c.setCinemaId(session.cinema.cinemaId);
				c.setCinemaName(session.cinema.cinemaName);
				c.setCountryCode(session.cinema.countryCode);
				obj.setCinema(c);

				const m = new Movie();
				m.setMovieId(session.movie.movieId);
				m.setTitle(session.movie.title);
				obj.setMovie(m);

				const cr = new CinemaRoom();
				cr.setCinemaRoomId(session.cinemaRoomId);
				cr.setRoomNumber(session.cinemas_rooms.roomNumber);
				obj.setCinemaRoom(cr);

				const q = new Quality();
				q.setQualityId(session.qualityId);
				q.setQualityName(session.qualities.qualityName);
				obj.setQuality(q);

				obj.setStartDate(session.startDate);
				obj.setEndDate(session.endDate);
				obj.setStandartFreePlaces(session.standartFreePlaces);
				obj.setDisabledFreePlaces(session.disabledFreePlaces);
				return obj;
			}),
		};
	}
}
