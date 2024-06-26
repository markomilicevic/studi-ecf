import GetQualitiesController from "./Adapter/Http/GetQualities/GetQualitiesController.js";
import GetQualitiesRepository from "./Adapter/Sequelize/GetQualities/GetQualitiesRepository.js";
import GetQualitiesService from "./UseCase/GetQualities/GetQualitiesService.js";

export const loadQualityRoutes = (app) => {
	app.get("/api/v1/qualities", async (req, res) => {
		try {
			const controller = new GetQualitiesController(null, new GetQualitiesService(new GetQualitiesRepository()));
			const response = await controller.handle();
			res.status(200).json(response);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: true });
		}
	});
};
