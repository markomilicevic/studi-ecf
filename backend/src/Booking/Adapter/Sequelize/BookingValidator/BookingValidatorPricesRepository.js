import { Op } from "sequelize";

import Price from "../../../Business/Price.js";
import PriceModel from "../PriceModel.js";

export default class BookingValidatorPricesRepository {
	async fetchOne({ qualityId = null, countryCode = null }) {
		const query = {
			where: {},
			// This order clause is required since this stable didn't have a primary key
			order: [["createdAt", "DESC"]],
		};
		if (qualityId) {
			query.where.qualityId = { [Op.eq]: qualityId };
		}
		if (countryCode) {
			query.where.countryCode = { [Op.eq]: countryCode };
		}
		const price = await PriceModel.findOne(query);
		if (!price) {
			return null;
		}

		const obj = new Price();
		obj.setQualityId(price.qualityId);
		obj.setCountryCode(price.countryCode);
		obj.setPriceValue(parseFloat(price.priceValue, 10));
		obj.setPriceUnit(price.priceUnit);
		return obj;
	}
}
