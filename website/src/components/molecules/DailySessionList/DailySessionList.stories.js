import moment from "moment";

import DailySessionList from "./DailySessionList.jsx";

export default {
	title: "Organisms/DailySessionList",
	component: DailySessionList,
};

export const NoSession = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 0,
		dailySessions: [],
	},
};

export const OneTodaySession = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 0,
		dailySessions: [
			{
				id: "first-session-id",
				startDate: moment(new Date()).format(),
			},
		],
	},
};

export const ManyTodaySessions = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 0,
		dailySessions: [
			{
				id: "first-session-id",
				startDate: moment(new Date()).format(),
			},
			{
				id: "second-session-id",
				startDate: moment(new Date()).format(),
			},
			{
				id: "third-session-id",
				startDate: moment(new Date()).format(),
			},
		],
	},
};

export const OneTomorrowSession = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 1,
		dailySessions: [
			{
				id: "first-session-id",
				startDate: moment(new Date()).add(1, "days").format(),
			},
		],
	},
};

export const OneADaySession = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 2,
		dailySessions: [
			{
				id: "first-session-id",
				startDate: moment(new Date()).add(2, "days").format(),
			},
		],
	},
};

export const OneAWeekSession = {
	args: {
		firstDayDate: moment(new Date()).format(),
		currentDayIndex: 7,
		dailySessions: [
			{
				id: "first-session-id",
				startDate: moment(new Date()).add(7, "days").format(),
			},
		],
	},
};
