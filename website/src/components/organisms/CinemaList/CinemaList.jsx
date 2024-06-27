import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import parsePhoneNumber from "libphonenumber-js";

import { CountryList } from "components/molecules/CountryList";

export default function CinemaList({ data, error = false, isLoading = false, countryCode, setCountryCode, cinema, setCinema, showDetails = false }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	if (isLoading) {
		return "...";
	}
	if (error) {
		return "Une erreur est survenue";
	}
	if (!data?.length) {
		return "Pas de cinema";
	}

	const countryElm = (
		<CountryList
			data={data}
			error={error}
			isLoading={isLoading}
			countryCode={countryCode}
			setCountryCode={(newCountryCode) => {
				setCountryCode(newCountryCode);
				setCinema(null);
			}}
		/>
	);

	const cinemaElm = !countryCode ? (
		<></>
	) : (
		<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
			<span>Votre cinéma :</span>
			{!cinema ? (
				<Box sx={{ minWidth: 250 }}>
					<FormControl fullWidth>
						<InputLabel id="cinema-list-select-cinema-label">Selectionner le cinéma</InputLabel>
						<Select
							labelId="cinema-list-select-cinema-label"
							id="cinema-list-select-cinema"
							data-testid="cinema-list-select-cinema"
							label="Selectionner le cinéma"
							value=""
							onChange={(event) => setCinema(data.find((cinema) => cinema.cinemaId === event.target.value))}
						>
							{data
								.filter((cinema) => cinema.countryCode === countryCode)
								.map((cinema) => (
									<MenuItem key={cinema.cinemaId} value={cinema.cinemaId}>
										{cinema.cinemaName}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Box>
			) : !showDetails ? (
				<div data-testid="cinema-list-selected-cinema" style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
					<strong>{cinema.cinemaName}</strong>
					<Button variant="contained" onClick={() => setCinema(null)} data-testid="cinema-list-change-cinema">
						Changer de cinéma
					</Button>
				</div>
			) : (
				<div data-testid="cinema-list-selected-cinema-details" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<strong>{cinema.cinemaName}</strong>
						<Button variant="contained" onClick={() => setCinema(null)} data-testid="cinema-list-change-cinema">
							Changer de cinéma
						</Button>
					</div>
					<p>{cinema.address}</p>
					<p>{parsePhoneNumber(cinema.phoneNumber).formatNational()}</p>
					<p>{cinema.openingHours}</p>
				</div>
			)}{" "}
		</div>
	);

	return (
		<div
			data-testid="cinema-list"
			style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 40, alignItems: !isMobile ? "center" : undefined }}
		>
			<div>{countryElm}</div>
			<div>{cinemaElm}</div>
		</div>
	);
}
