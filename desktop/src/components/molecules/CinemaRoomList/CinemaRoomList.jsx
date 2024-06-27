import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function CinemaRoomList({
	cinemasData,
	cinemasError,
	cinemasIsLoading,
	countryCode,
	setCountryCode,
	cinema,
	setCinema,
	cinemaRoomsData,
	cinemaRoomsError,
	cinemaRoomsIsLoading,
	cinemaRoom,
	setCinemaRoom,
}) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	if (cinemasIsLoading) {
		return "...";
	}
	if (cinemasError) {
		return "An error occured";
	}
	if (!cinemasData?.length) {
		return "No cinema";
	}

	const countryElm = (
		<div data-testid="country-list" style={{ display: "flex", gap: 10, alignItems: "center" }}>
			<span>Pays :</span>
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
							{[...new Set(cinemasData.map((cinema) => cinema.countryCode))].map((countryCode) => (
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
							setCinema(null);
							setCinemaRoom(null);
						}}
						data-testid="country-list-change-country"
					>
						Changer de pays
					</Button>
				</span>
			)}
		</div>
	);

	const cinemaElm = !countryCode ? (
		<></>
	) : (
		<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
			<span>Cinéma :</span>
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
							onChange={(event) => setCinema(cinemasData.find((cinema) => cinema.cinemaId === event.target.value))}
						>
							{cinemasData
								.filter((cinema) => cinema.countryCode === countryCode)
								.map((cinema) => (
									<MenuItem key={cinema.cinemaId} value={cinema.cinemaId}>
										{cinema.cinemaName}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Box>
			) : (
				<div data-testid="cinema-list-selected-cinema" style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
					<strong>{cinema.cinemaName}</strong>
					<Button
						variant="contained"
						onClick={() => {
							setCinema(null);
							setCinemaRoom(null);
						}}
						data-testid="cinema-list-change-cinema"
					>
						Changer de cinéma
					</Button>
				</div>
			)}
		</div>
	);

	const cinemaRoomElm =
		!cinema || !cinemaRoomsData?.length ? (
			<></>
		) : (
			<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
				<span>Salle :</span>
				{!cinemaRoom ? (
					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel id="cinema-room-list-select-cinema-room-label">Selectionner la salle</InputLabel>
							<Select
								labelId="cinema-room-list-select-cinema-room-label"
								id="cinema-room-list-select-cinema-room"
								data-testid="cinema-room-list-select-cinema-room"
								label="Selectionner la salle"
								value=""
								onChange={(event) => setCinemaRoom(cinemaRoomsData.find((cinemaRoom) => cinemaRoom.cinemaRoomId === event.target.value))}
							>
								{cinemaRoomsData.map((cinemaRoom) => (
									<MenuItem key={cinemaRoom.cinemaRoomId} value={cinemaRoom.cinemaRoomId}>
										{cinemaRoom.roomNumber}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				) : (
					<div data-testid="cinema-room-list-selected-cinema-room" style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
						<strong>{cinemaRoom.roomNumber}</strong>
						<Button variant="contained" onClick={() => setCinemaRoom(null)} data-testid="cinema-room-list-change-cinema-room">
							Changer de salle
						</Button>
					</div>
				)}
			</div>
		);

	return (
		<div
			data-testid="cinema-list"
			style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 40, alignItems: !isMobile ? "center" : undefined }}
		>
			<div>{countryElm}</div>
			<div>{cinemaElm}</div>
			<div>{cinemaRoomElm}</div>
		</div>
	);
}
