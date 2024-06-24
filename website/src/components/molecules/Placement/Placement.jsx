import Checkbox from "@mui/material/Checkbox";

export default function Placement({ placeNumber, isReservedPlace, isDisabledPlace, isSelectable, isSelected, onChange }) {
	return (
		<div data-testid="placement">
			{isReservedPlace ? (
				<div>
					<p>
						<strong>{placeNumber}</strong>
					</p>
					<div>
						<span>Reservée</span>
					</div>
				</div>
			) : (
				<label>
					<p>
						<strong>{placeNumber}</strong>
					</p>
					<p>
						<Checkbox
							name="placeNumber"
							value={placeNumber}
							onChange={(event) => {
								if (!isSelectable && event.target.checked) {
									event.preventDefault();
									return;
								}
								onChange(event);
							}}
							disabled={(!isSelectable && !isSelected) || undefined}
							checked={isSelected || undefined}
							data-testid={isSelectable ? "placement-select-placement" : undefined}
							sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
						/>
					</p>
					<p>{isDisabledPlace && <div>♿</div>}</p>
				</label>
			)}
		</div>
	);
}
