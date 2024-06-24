import moment from "moment";

import { getLastWednesdayOrToday } from "./dates.js";

describe("Dates helpers", () => {
	describe("getLastWednesdayOrToday()", () => {
		test.each([
			{ now: undefined },
			{ now: null },
			{ now: false },
			{ now: true },
			{ now: "" },
			{ now: "Hello" },
			{ now: {} },
			{ now: new Date() }, // Only moment object accepted
		])('should throw an error when passed now parameter as "$now"', ({ now }) => {
			expect(() => {
				getLastWednesdayOrToday(now);
			}).toThrow(Error);
		});

		test.each([
			{ now: moment("2034-05-18T04:11:48Z"), expected: "2034-05-17" },
			{ now: moment("2034-05-17T04:11:48Z"), expected: "2034-05-17" },
			{ now: moment("2024-05-23T04:11:48Z"), expected: "2024-05-22" },
			{ now: moment("2024-05-22T04:11:48Z"), expected: "2024-05-22" },
			{ now: moment("2024-05-21T04:11:48Z"), expected: "2024-05-15" },
		])("should return last Wednesday for $now", ({ now, expected }) => {
			expect(getLastWednesdayOrToday(now)).toEqual(expected);
		});
	});
});
