import TextField from "@mui/material/TextField";

export default function PlacesNumber({ placements, setPlacements }) {
	return (
		<div data-testid="places-number" style={{ display: "flex", gap: 20 }}>
			<TextField
				required
				id="places-number-total-number"
				label="Nombre de personnes total"
				type="number"
				value={placements.totalPlacesNumber}
				data-testid="places-number-total-number"
				onChange={(event) => {
					setPlacements({
						...placements,
						totalPlacesNumber: parseInt(event.target.value, 10),
						disabledPlacesNumber: Math.min(event.target.value, placements.disabledPlacesNumber),
					});
				}}
			/>

			<TextField
				required
				id="places-number-disabled-number"
				label="Dont places handicapées"
				type="number"
				value={placements.disabledPlacesNumber}
				data-testid="places-number-disabled-number"
				onChange={(event) => {
					setPlacements({ ...placements, disabledPlacesNumber: Math.min(event.target.value, placements.totalPlacesNumber) });
				}}
			/>
		</div>
	);
}
