import axios from "axios";

import Country from "../../../Business/Country.js";

export default class GetClosestCinemaRepository {
	/**
	 * Retrieve GeoIP's country code from geojs.io
	 * Doc: https://www.geojs.io/docs/v1/endpoints/country/
	 * Note: No limitation specified on the documentation
	 */
	async fetch({ remoteAddr }) {
		const country = new Country();
		try {
			const apiUrl = ![null, "::1", "127.0.0.1"].includes(remoteAddr)
				? `https://get.geojs.io/v1/ip/country/${encodeURIComponent(remoteAddr)}.json`
				: "https://get.geojs.io/v1/ip/country.json";
			const response = await axios.get(apiUrl, {
				// 1 second (because it's a remote service)
				// TODO: Monitor this remote service performances to adapt the right timeout (P95 response time for exemple)
				timeout: 1000,
			});

			// Verify the response
			if (response?.status !== 200) {
				throw new Error(`Request failed with ${response?.status || "undefined"} status code`);
			}
			if (!response?.data?.country_3) {
				throw new Error("Missing country_3 in response");
			}

			country.setCountryCode(response.data.country_3);
		} catch (error) {
			// This case occured because it's a remote service (timeout, quota, ...)
			console.error("GeoJs failed", error);
			return null;
		}

		return country;
	}
}
