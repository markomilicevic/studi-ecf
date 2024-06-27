import { Op } from "sequelize";

import Cinema from "../../../Business/Cinema.js";
import CinemaModel from "../CinemaModel.js";

export default class BookingValidatorCinemasRepository {
	async fetchOne({ cinemaId = null }) {
		const query = {
			where: {},
		};
		if (cinemaId) {
			query.where.cinemaId = { [Op.eq]: cinemaId };
		}
		const cinema = await CinemaModel.findOne(query);
		if (!cinema) {
			return null;
		}

		const obj = new Cinema();
		obj.setCinemaId(cinema.cinemaId);
		obj.setCountryCode(cinema.countryCode);
		return obj;
	}
}
