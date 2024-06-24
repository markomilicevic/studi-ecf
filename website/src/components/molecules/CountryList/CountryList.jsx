import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function CountryList({ data, error = false, isLoading = false, countryCode, setCountryCode }) {
	if (isLoading) {
		return "...";
	}
	if (error) {
		return "Une erreur est survenue";
	}
	if (!data?.length) {
		return "Pas de cinema";
	}

	return (
		<div data-testid="country-list" style={{ display: "flex", gap: 10, alignItems: "center" }}>
			<span>Votre pays :</span>
			{!countryCode ? (
				<Box sx={{ minWidth: 200 }}>
					<FormControl fullWidth>
						<InputLabel id="country-list-select-country-label">Selectionner le pays</InputLabel>
						<Select
							labelId="country-list-select-country-label"
							id="country-list-select-country"
							data-testid="country-list-select-country"
							label="Selectionner le pays"
							value=""
							onChange={(event) => setCountryCode(event.target.value)}
						>
							{[...new Set(data.map((cinema) => cinema.countryCode))].map((countryCode) => (
								<MenuItem key={countryCode} value={countryCode}>
									{countryCode}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			) : (
				<span data-testid="country-list-selected-country" style={{ display: "flex", gap: 10, alignItems: "center" }}>
					<strong>{countryCode}</strong>{" "}
					<Button
						variant="contained"
						onClick={() => {
							setCountryCode(null);
						}}
						data-testid="country-list-change-country"
					>
						Changer de pays
					</Button>
				</span>
			)}
		</div>
	);
}
