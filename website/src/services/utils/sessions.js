import moment from "moment";

/**
 * Group the sessions by day for user-friendly display
 * Sort if not already sorted
 *
 * @param {array} sessions Array of sessions
 * @returns array Multi-dimensional array of sessions (one per day then one per session)
 */
export const groupSessionsByDay = (sessions) => {
	if (!Array.isArray(sessions)) {
		throw new Error("sessions must be an array");
	}

	if (sessions.length === 0) {
		// Optimization: when no sessions
		return [];
	} else if (sessions.length === 1) {
		// Optimization: when only one session
		return [[sessions[0]]];
	}

	// Find the nbr of days

	const dateRange = sessions.reduce(
		(acc, session) => {
			const startDate = `${moment(session.startDate).format("YYYY-MM-DD")}T00:00:00.000Z`;

			if (!acc.minimalDate || !acc.maximalDate) {
				acc.minimalDate = startDate;
				acc.maximalDate = startDate;
			}

			const diffFromMinimal = moment(startDate).diff(moment(acc.minimalDate), "days");
			if (diffFromMinimal <= 0) {
				acc.minimalDate = startDate;
			}

			const diffFromMaximal = moment(startDate).diff(moment(acc.maximalDate), "days");
			if (diffFromMaximal >= 0) {
				acc.maximalDate = startDate;
			}

			return acc;
		},
		{
			minimalDate: null,
			maximalDate: null,
		}
	);

	const nbrOfDays = moment(dateRange.maximalDate).diff(moment(dateRange.minimalDate), "days");

	// Fill the array with the nbr of days (as one day per entry)

	const groupedSessions = Array(nbrOfDays).fill(null);

	// Associate the sessions

	sessions.forEach((session) => {
		const currentDayIndex = moment(session.startDate).diff(moment(dateRange.minimalDate), "days");
		groupedSessions[currentDayIndex] = groupedSessions[currentDayIndex] || [];

		groupedSessions[currentDayIndex].push(session);

		// Sort the same day sessions (if not already sorted)
		groupedSessions[currentDayIndex].sort((a, b) => {
			if (a.startDate < b.startDate) {
				return -1;
			} else if (a.startDate > b.startDate) {
				return 1;
			}
			return 0;
		});
	});

	return groupedSessions;
};
