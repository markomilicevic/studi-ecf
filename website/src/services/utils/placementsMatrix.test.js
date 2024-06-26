import { isValidPlacementsMatrix, countTotalNumberOfPlacements } from "./placementsMatrix";

describe("PlacementsMatrix helpers", () => {
	describe("isValidPlacementsMatrix()", () => {
		test.each([
			{ placementsMatrix: undefined },
			{ placementsMatrix: null },
			{ placementsMatrix: false },
			{ placementsMatrix: true },
			{ placementsMatrix: 1 },
			{ placementsMatrix: 1.23 },
			{ placementsMatrix: [] },
			{ placementsMatrix: [1] },
			{ placementsMatrix: {} },
			{ placementsMatrix: { a: "b" } },
			{ placementsMatrix: "SSS\rDDD" }, // CRLF (Windows new lines)
			{ placementsMatrix: "SSS\rDDD" }, // CR (Mac new lines)
			{ placementsMatrix: "A" }, // Unsupported flag
		])('should return false when passed placementsMatrix parameter as "$placementsMatrix"', ({ placementsMatrix }) => {
			expect(isValidPlacementsMatrix(placementsMatrix)).toEqual(false);
		});

		test.each([
			{ placementsMatrix: "" }, // Empty string accepted
			{ placementsMatrix: "SSS DDD" }, // One row
			{ placementsMatrix: "SSS DDD\nSSS DDD" }, // Two rows
			{ placementsMatrix: "SSS DDD\nD S" }, // two rows with not the same number of placements per row
		])('should return true when passed placementsMatrix parameter as "$placementsMatrix"', ({ placementsMatrix }) => {
			expect(isValidPlacementsMatrix(placementsMatrix)).toEqual(true);
		});
	});

	describe('countTotalNumberOfPlacements()', () => {
		test.each([
			{ placementsMatrix: "", expectedTotal: 0 }, // Empty string accepted
			{ placementsMatrix: "SSS DDD", expectedTotal: 6 }, // One row
			{ placementsMatrix: "SSS DDD\nSSS DDD", expectedTotal: 12 }, // Two rows
			{ placementsMatrix: "SSS DDD\nD S", expectedTotal: 8 }, // two rows with not the same number of placements per row
		])('should return true when passed placementsMatrix parameter as "$placementsMatrix"', ({ placementsMatrix, expectedTotal }) => {
			expect(countTotalNumberOfPlacements(placementsMatrix)).toEqual(expectedTotal);
		});
	})
});
