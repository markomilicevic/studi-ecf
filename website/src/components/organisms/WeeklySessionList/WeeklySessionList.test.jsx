import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { composeStories } from "@storybook/react";

import * as stories from "./WeeklySessionList.stories.js";

const { NoSession, OneSession, TwoSessionsOnTwoWeeks, TwoSessionsOnThreeWeeks } = composeStories(stories);

describe("<WeeklySessionList>", () => {
	describe("when empty session list", () => {
		beforeEach(() => {
			cleanup();

			render(<NoSession />);
		});

		it("should render no session", () => {
			expect(screen.getByTestId("weekly-session-list-no-session")).toBeTruthy();
		});

		it("should NOT render navigation", () => {
			expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
			expect(screen.queryByTestId("weekly-session-list-next-navigation")).toBeFalsy();
		});
	});

	describe("when one today session", () => {
		beforeEach(() => {
			cleanup();

			render(<OneSession />);
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
		});

		it("should NOT render navigation", () => {
			expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
			expect(screen.queryByTestId("weekly-session-list-next-navigation")).toBeFalsy();
		});
	});

	describe("when two sessions on two weeks", () => {
		beforeEach(() => {
			cleanup();

			render(<TwoSessionsOnTwoWeeks />);
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
		});

		it("should render navigation", () => {
			expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
			expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
		});

		describe("when click on next navigation", () => {
			beforeEach(() => {
				cleanup();

				render(<TwoSessionsOnTwoWeeks />);

				fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
			});

			it("should render the session", () => {
				expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
			});

			it("should render navigation", () => {
				expect(screen.getByTestId("weekly-session-list-previous-navigation")).toBeTruthy();
				expect(screen.queryByTestId("weekly-session-list-next-navigation")).toBeFalsy();
			});

			describe("when click on previous navigation", () => {
				beforeEach(() => {
					cleanup();

					render(<TwoSessionsOnTwoWeeks />);

					fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
					fireEvent.click(screen.getByTestId("weekly-session-list-previous-navigation"));
				});

				it("should render the session", () => {
					expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
				});

				it("should render navigation", () => {
					expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
					expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
				});
			});
		});
	});

	describe("when two sessions on three weeks", () => {
		beforeEach(() => {
			cleanup();

			render(<TwoSessionsOnThreeWeeks />);
		});

		it("should render the session", () => {
			expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
		});

		it("should render navigation", () => {
			expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
			expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
		});

		describe("when click on next navigation", () => {
			beforeEach(() => {
				cleanup();

				render(<TwoSessionsOnThreeWeeks />);

				fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
			});

			it("should render the session", () => {
				expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
			});

			it("should render navigation", () => {
				expect(screen.getByTestId("weekly-session-list-previous-navigation")).toBeTruthy();
				expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
			});

			describe("when click on next navigation", () => {
				beforeEach(() => {
					cleanup();

					render(<TwoSessionsOnThreeWeeks />);

					fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
					fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
				});

				it("should render the session", () => {
					expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
				});

				it("should render navigation", () => {
					expect(screen.getByTestId("weekly-session-list-previous-navigation")).toBeTruthy();
					expect(screen.queryByTestId("weekly-session-list-next-navigation")).toBeFalsy();
				});

				describe("when click on previous navigation", () => {
					beforeEach(() => {
						cleanup();

						render(<TwoSessionsOnThreeWeeks />);

						fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
						fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
						fireEvent.click(screen.getByTestId("weekly-session-list-previous-navigation"));
					});

					it("should render the session", () => {
						expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
					});

					it("should render navigation", () => {
						expect(screen.getByTestId("weekly-session-list-previous-navigation")).toBeTruthy();
						expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
					});

					describe("when click on previous navigation", () => {
						beforeEach(() => {
							cleanup();

							render(<TwoSessionsOnThreeWeeks />);

							fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
							fireEvent.click(screen.getByTestId("weekly-session-list-next-navigation"));
							fireEvent.click(screen.getByTestId("weekly-session-list-previous-navigation"));
							fireEvent.click(screen.getByTestId("weekly-session-list-previous-navigation"));
						});

						it("should render the session", () => {
							expect(screen.getAllByTestId("weekly-session-list-day").length).toEqual(7);
						});

						it("should render navigation", () => {
							expect(screen.queryByTestId("weekly-session-list-previous-navigation")).toBeFalsy();
							expect(screen.getByTestId("weekly-session-list-next-navigation")).toBeTruthy();
						});
					});
				});
			});
		});
	});
});
