import { useState } from "react";

import { Placement } from "components/molecules/Placement";

export default function Placements({ placementsMatrix, reservedPlacementNumbers, standartPlacesNumber, disabledPlacesNumber, onChange }) {
	const [selectedStandartPlacesNumbers, setSelectedStandartPlacesNumbers] = useState([]);
	const [selectedDisabledPlacesNumbers, setSelectedDisabledPlacesNumbers] = useState([]);

	let placesCounter = 0;
	return (
		<table data-testid="placements">
			{(placementsMatrix || "").split("\n").map((row, rowIndex) => (
				<tr key={rowIndex}>
					{(row || "").split("").map((column, columnIndex) => {
						let placeNumber = 0;
						let isPlace = false;
						let isReservedPlace = false;
						let isSelectedPlace = false;
						let isDisabledPlace = false;
						if (["S", "D"].includes(column)) {
							placeNumber = ++placesCounter;

							isPlace = true;

							if (reservedPlacementNumbers.includes(placeNumber)) {
								isReservedPlace = true;
							} else if (selectedStandartPlacesNumbers.includes(placeNumber) || selectedDisabledPlacesNumbers.includes(placeNumber)) {
								isSelectedPlace = true;
							}

							if (column === "D") {
								isDisabledPlace = true;
							}
						}

						return (
							<td key={columnIndex} style={{ verticalAlign: "top", textAlign: "center" }}>
								{isPlace && (
									<Placement
										placeNumber={placeNumber}
										isReservedPlace={isReservedPlace}
										isDisabledPlace={isDisabledPlace}
										isSelectable={
											isDisabledPlace
												? selectedDisabledPlacesNumbers.length < disabledPlacesNumber
												: selectedStandartPlacesNumbers.length < standartPlacesNumber
										}
										isSelected={isSelectedPlace}
										onChange={(event) => {
											if (isDisabledPlace) {
												if (event.target.checked) {
													setSelectedDisabledPlacesNumbers([...selectedDisabledPlacesNumbers, placeNumber]);
												} else {
													setSelectedDisabledPlacesNumbers(selectedDisabledPlacesNumbers.filter((pn) => pn !== placeNumber));
												}
											} else {
												if (event.target.checked) {
													setSelectedStandartPlacesNumbers([...selectedStandartPlacesNumbers, placeNumber]);
												} else {
													setSelectedStandartPlacesNumbers(selectedStandartPlacesNumbers.filter((pn) => pn !== placeNumber));
												}
											}

											onChange(placeNumber, event.target.checked);
										}}
									/>
								)}
							</td>
						);
					})}
				</tr>
			))}
		</table>
	);
}
