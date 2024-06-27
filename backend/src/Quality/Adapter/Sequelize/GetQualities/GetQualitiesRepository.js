import Quality from "../../../Business/Quality.js";
import QualityModel from "../QualityModel.js";

export default class GetQualitiesRepository {
	async fetchAll({ limit }) {
		const qualities = await QualityModel.findAll({
			order: [["qualityName", "ASC"]],
			limit,
		});

		return qualities.map((quality) => {
			const obj = new Quality();
			obj.setQualityId(quality.qualityId);
			obj.setQualityName(quality.qualityName);
			return obj;
		});
	}
}
