import sharp from "sharp";

import Response from "../../../Common/Utils/Response.js";

export const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

export default class UploadMoviePosterService {
	async execute(query) {
		const res = new Response();
		const errors = [];

		// We verify again: don't trust the user's inputs
		if (!query.image) {
			errors.push("MISSING_FILE");
		}
		if (!/.+\.jpg$/.test(query.image.name)) {
			errors.push("WRONG_EXTENSION");
		}
		if (!/^image/.test(query.image.mimetype)) {
			errors.push("WRONG_MIMETYPE");
		}
		if (query.size > MAX_FILE_SIZE_IN_BYTES) {
			errors.push("TOO_BIG_FILESIZE");
		}

		if (errors.length) {
			res.setStatus("USER_ERRORS");
			res.setErrors(errors);
			return res;
		}

		// It's enough random that duplicates are "near impossible"
		const posterId = crypto.randomUUID();

		// Copy the raw image
		await sharp(query.image.tempFilePath).jpeg({ quality: 100 }).toFile(`${process.cwd()}/../static/posters/${posterId}.raw.jpg`);

		// Resize and compress the final image
		await sharp(`${process.cwd()}/../static/posters/${posterId}.raw.jpg`)
			.resize({ width: 310, height: 420 })
			.jpeg({ quality: 80 })
			.toFile(`${process.cwd()}/../static/posters/${posterId}.jpg`);

		res.setData({ posterId });
		return res;
	}
}
