import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { composeStories } from "@storybook/react";

import * as stories from "./DailySessionList.stories.js";

const { NoSession, OneTodaySession, ManyTodaySessions, OneTomorrowSession, OneADaySession, OneAWeekSession } = composeStories(stories);

describe("<DailySessionList>", () => {
	describe("when empty session list", () => {
		beforeEach(() => {
			cleanup();

			render(<NoSession />);
		});

		it("should render no session", () => {
			expect(screen.getByTestId("daily-session-list-no-session")).toBeTruthy();
		});
	});

	describe("when one today session", () => {
		beforeEach(() => {
			cleanup();

			render(<OneTodaySession />);
		});

		it("should render the date", () => {
			expect(screen.getByTestId("daily-session-list-its-today")).toBeTruthy();
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("daily-session-list-session").length).toEqual(1);
		});
	});

	describe("when many today sessions", () => {
		beforeEach(() => {
			cleanup();

			render(<ManyTodaySessions />);
		});

		it("should render the date", () => {
			expect(screen.getByTestId("daily-session-list-its-today")).toBeTruthy();
		});

		it("should render the sessions", () => {
			expect(screen.getAllByTestId("daily-session-list-session").length).toEqual(3);
		});
	});

	describe("when one tomorrow session", () => {
		beforeEach(() => {
			cleanup();

			render(<OneTomorrowSession />);
		});

		it("should render the date", () => {
			expect(screen.getByTestId("daily-session-list-its-tomorrow")).toBeTruthy();
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("daily-session-list-session").length).toEqual(1);
		});
	});

	describe("when one a day session", () => {
		beforeEach(() => {
			cleanup();

			render(<OneADaySession />);
		});

		it("should render the date", () => {
			expect(screen.getByTestId("daily-session-list-its-a-day")).toBeTruthy();
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("daily-session-list-session").length).toEqual(1);
		});
	});

	describe("when one a week session", () => {
		beforeEach(() => {
			cleanup();

			render(<OneAWeekSession />);
		});

		it("should render the date", () => {
			expect(screen.getByTestId("daily-session-list-its-a-day")).toBeTruthy();
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("daily-session-list-session").length).toEqual(1);
		});
	});
});
