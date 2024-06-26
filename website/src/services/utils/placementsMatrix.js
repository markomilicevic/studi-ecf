/**
 * Check if the passed placement matrix is syntaxically valid
 *
 * @param {string} placementsMatrix
 * @returns boolean
 */
export const isValidPlacementsMatrix = (placementsMatrix) => {
	if (typeof placementsMatrix !== "string") {
		// Undefined, null of falsy
		return false;
	}

	return !placementsMatrix.split("").some((flag) => !["S", "D", " ", "\n"].includes(flag));
};

/**
 * Count the total number of placements in a placement matrix
 * Important: `isValidPlacementsMatrix` must be used as checker before calling `countTotalNumberOfPlacements`
 *
 * @param {string} placementsMatrix
 * @returns number
 */
export const countTotalNumberOfPlacements = (placementsMatrix) => {
	return placementsMatrix.split("").reduce((acc, flag) => {
		if (["S", "D"].includes(flag)) {
			return acc + 1;
		}
		return acc;
	}, 0);
};
