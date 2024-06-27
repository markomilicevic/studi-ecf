import CinemaModel from "../CinemaModel.js";
import Cinema from "../../../Business/Cinema.js";

export default class GetCinemasRepository {
	async fetchAll({ limit }) {
		const cinemas = await CinemaModel.findAll({
			order: [
				["countryCode", "ASC"],
				["cinemaName", "ASC"],
			],
			limit,
		});

		return cinemas.map((cinema) => {
			const obj = new Cinema();
			obj.setCinemaId(cinema.cinemaId);
			obj.setCinemaName(cinema.cinemaName);
			obj.setCountryCode(cinema.countryCode);
			obj.setAddress(cinema.address);
			obj.setPhoneNumber(cinema.phoneNumber);
			obj.setOpeningHours(cinema.openingHours);
			return obj;
		});
	}
}
