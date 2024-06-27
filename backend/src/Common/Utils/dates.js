import moment from "moment";

/**
 * Get the last Wednesday
 * Can be from current or previous week
 *
 * @param {moment} now Current date
 * @returns {string} Last Wednesday as date (ex: "2024-05-22")
 */
export const getLastWednesdayOrToday = (now) => {
	if (!now || !moment.isMoment(now)) {
		throw new Error("Must be an moment object");
	}

	return moment(now)
		.day(now.day() >= 3 ? 3 : -4)
		.format("YYYY-MM-DD");
};
