import { groupSessionsByDay } from "./sessions";

describe("Sessions helpers", () => {
	describe("groupSessionsByDay()", () => {
		it("should throw an error when sessions is not an array", () => {
			expect(() => {
				groupSessionsByDay(null);
			}).toThrow(Error);
		});

		it("should return empty array when no sessions", () => {
			expect(groupSessionsByDay([])).toEqual([]);
		});

		it("should return the one today session", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two today sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-01T12:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
					{
						id: "second-session-id",
						startDate: "2000-01-01T12:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two today and tommorow sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-02T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
				],
				[
					{
						id: "second-session-id",
						startDate: "2000-01-02T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two today and after tommorow sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-03T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
				],
				null,
				[
					{
						id: "second-session-id",
						startDate: "2000-01-03T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two today and next week sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-08T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
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
						startDate: "2000-01-08T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two today and in two weeks sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-15T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
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
						startDate: "2000-01-15T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the two days closed sessions", () => {
			const sessions = [
				{
					id: "first-session-id",
					startDate: "2000-01-01T20:00:00.000Z",
				},
				{
					id: "second-session-id",
					startDate: "2000-01-02T04:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T20:00:00.000Z",
					},
				],
				[
					{
						id: "second-session-id",
						startDate: "2000-01-02T04:00:00.000Z",
					},
				],
			]);
		});

		it("should return the sorted same day sessions", () => {
			const sessions = [
				{
					id: "second-session-id",
					startDate: "2000-01-01T12:00:00.000Z",
				},
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
					{
						id: "second-session-id",
						startDate: "2000-01-01T12:00:00.000Z",
					},
				],
			]);
		});

		it("should return the sorted two days sessions", () => {
			const sessions = [
				{
					id: "second-session-id",
					startDate: "2000-01-02T10:00:00.000Z",
				},
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
				],
				[
					{
						id: "second-session-id",
						startDate: "2000-01-02T10:00:00.000Z",
					},
				],
			]);
		});

		it("should return the sorted three days sessions", () => {
			const sessions = [
				{
					id: "second-session-id",
					startDate: "2000-01-03T10:00:00.000Z",
				},
				{
					id: "first-session-id",
					startDate: "2000-01-01T10:00:00.000Z",
				},
			];
			expect(groupSessionsByDay(sessions)).toEqual([
				[
					{
						id: "first-session-id",
						startDate: "2000-01-01T10:00:00.000Z",
					},
				],
				null,
				[
					{
						id: "second-session-id",
						startDate: "2000-01-03T10:00:00.000Z",
					},
				],
			]);
		});
	});
});
