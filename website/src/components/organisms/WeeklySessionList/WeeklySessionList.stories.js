import moment from "moment";

import WeeklySessionList from "./WeeklySessionList.jsx";

export default {
	title: "Organisms/WeeklySessionList",
	component: WeeklySessionList,
};

export const NoSession = {
	args: {
		weeklySessions: [],
	},
};

export const OneSession = {
	args: {
		weeklySessions: [
			[
				{
					id: "first-session-id",
					startDate: moment(new Date()).format(),
				},
			],
			null,
			null,
			null,
			null,
			null,
			null,
		],
	},
};

export const TwoSessionsOnTwoWeeks = {
	args: {
		weeklySessions: [
			[
				{
					id: "first-session-id",
					startDate: moment(new Date()).format(),
				},
			],
			null,
			null,
			null,
			null,
			null,
			null,
			[
				{
					id: "second-session-id",
					startDate: moment(new Date()).add(7, "days").format(),
				},
			],
		],
	},
};

export const TwoSessionsOnThreeWeeks = {
	args: {
		weeklySessions: [
			[
				{
					id: "first-session-id",
					startDate: moment(new Date()).format(),
				},
			],
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			[
				{
					id: "second-session-id",
					startDate: moment(new Date()).add(7, "days").format(),
				},
			],
		],
	},
};
