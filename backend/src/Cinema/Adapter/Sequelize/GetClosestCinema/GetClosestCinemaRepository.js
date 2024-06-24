import CinemaModel from "../CinemaModel.js";
import Cinema from "../../../Business/Cinema.js";

export default class GetClosestCinemaRepository {
	async fetchAll({ limit }) {
		const cinemas = await CinemaModel.findAll({
			attributes: ["countryCode"],
			group: "countryCode",
			limit,
		});

		return cinemas.map((cinema) => {
			const obj = new Cinema();
			obj.setCountryCode(cinema.countryCode);
			return obj;
		});
	}
}
