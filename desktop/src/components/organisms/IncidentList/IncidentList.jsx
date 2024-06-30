import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

import { CinemaRoomList } from "components/molecules/CinemaRoomList";
import { Pagination } from "components/molecules/Pagination";
import { IncidentModal } from "components/organisms/IncidentModal";

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveCinemaRooms = async ({ cinemaId }) => {
	if (!cinemaId) {
		return null;
	}

	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/${encodeURIComponent(cinemaId)}/rooms`);
	return response.data;
};

const retrieveCinemaRoomIncidents = async ({ cinemaId = null, cinemaRoomId = null, currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms/incidents`, {
		params: {
			cinemaId: cinemaId || undefined,
			cinemaRoomId: cinemaRoomId || undefined,
			currentPage,
			perPage,
		},
	});
	return response.data;
};

const submitDelete = async ({ cinemaRoomIncidentId }) => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms/incidents/${encodeURIComponent(cinemaRoomIncidentId)}`);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export default function IncidentList() {
	const [currentPage, setCurrentPage] = useState(1);
	const [countryCode, setCountryCode] = useState();
	const [cinema, setCinema] = useState();
	const [cinemaRoom, setCinemaRoom] = useState();
	const [incidentModalOpened, setIncidentModalOpened] = useState(false);
	const [selectedIncident, setSelectedIncident] = useState();

	const { data: cinemasData, error: cinemasError, isLoading: cinemasIsLoading } = useQuery("cinemas", retrieveCinemas);

	const {
		data: cinemaRoomsData,
		error: cinemaRoomsError,
		isLoading: cinemaRoomsIsLoading,
	} = useQuery(`cinemas-rooms-${cinema?.cinemaId}`, () =>
		retrieveCinemaRooms({
			cinemaId: cinema?.cinemaId,
		})
	);

	const { data: cinemaRoomIncidentsData, refetch: cinemaRoomIncidentsRefetch } = useQuery(
		`cinemas-rooms-incidents-${cinema?.cinemaId}-${cinemaRoom?.cinemaRoomId}`,
		() =>
			retrieveCinemaRoomIncidents({
				cinemaId: cinema?.cinemaId,
				cinemaRoomId: cinemaRoom?.cinemaRoomId,
				currentPage,
				perPage: 10,
			})
	);

	const { enqueueSnackbar } = useSnackbar();

	const deleteCinemaRoomIncident = useMutation({
		mutationFn: submitDelete,
	});

	return (
		<div>
			<h2>Gestion des incidents</h2>

			<CinemaRoomList
				cinemasData={cinemasData?.data}
				cinemasError={cinemasError}
				cinemasIsLoading={cinemasIsLoading}
				countryCode={countryCode}
				setCountryCode={setCountryCode}
				cinema={cinema}
				setCinema={setCinema}
				cinemaRoomsData={cinemaRoomsData?.data}
				cinemaRoomsError={cinemaRoomsError}
				cinemaRoomsIsLoading={cinemaRoomsIsLoading}
				cinemaRoom={cinemaRoom}
				setCinemaRoom={setCinemaRoom}
			/>

			<div style={{ display: "flex", justifyContent: "end", paddingTop: 20 }}>
				<Button
					variant="contained"
					onClick={() => {
						setSelectedIncident(null);
						setIncidentModalOpened(true);
					}}
					disabled={cinemaRoom && cinemaRoomIncidentsData?.data?.length}
				>
					Creer un incident
				</Button>
			</div>

			<div style={{ marginTop: 20 }}>
				{!cinemaRoomIncidentsData?.data?.length ? (
					"Aucun incident"
				) : (
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<StyledTableCell>Cinema</StyledTableCell>
									<StyledTableCell>Salle</StyledTableCell>
									<StyledTableCell>Incident</StyledTableCell>
									<StyledTableCell>Dernière mise à jour</StyledTableCell>
									<StyledTableCell>Actions</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cinemaRoomIncidentsData.data.map((incident) => (
									<StyledTableRow key={incident.cinemaRoomIncidentId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<StyledTableCell component="th" scope="row">
											{incident.cinemaName}
										</StyledTableCell>
										<StyledTableCell component="th" scope="row">
											{incident.roomNumber}
										</StyledTableCell>
										<StyledTableCell component="th" scope="row">
											<pre>{incident.incident}</pre>
										</StyledTableCell>
										<StyledTableCell component="th" scope="row">
											{moment(incident.lastModifiedAt).format("LLL")}
										</StyledTableCell>
										<StyledTableCell component="th" scope="row">
											<Button
												variant="contained"
												onClick={() => {
													setCountryCode(cinemasData?.data.find((cinema) => cinema.cinemaId === incident.cinemaId).countryCode);
													setCinema(cinemasData?.data.find((cinema) => cinema.cinemaId === incident.cinemaId));
													setCinemaRoom(
														cinemaRoomsData?.data.find((cinemaRoom) => cinemaRoom.cinemaRoomId === incident.cinemaRoomId)
													);
													setSelectedIncident(incident);
													setIncidentModalOpened(true);
												}}
											>
												Editer
											</Button>{" "}
											<Button
												variant="contained"
												onClick={() => {
													if (
														window.confirm(
															`Êtes-vous sûr de supprimer l'incident dans la salle ${incident.roomNumber} du cinéma "${incident.cinemaName}" ?`
														)
													) {
														deleteCinemaRoomIncident.mutate(
															{ cinemaRoomIncidentId: incident.cinemaRoomIncidentId },
															{
																onSuccess: () => {
																	cinemaRoomIncidentsRefetch();
																	enqueueSnackbar("Incident supprimée");
																},
															}
														);
													}
												}}
											>
												Supprimer
											</Button>
										</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
				{incidentModalOpened && (
					<IncidentModal
						cinemasData={cinemasData?.data}
						cinemasError={cinemasError}
						cinemasIsLoading={cinemasIsLoading}
						countryCode={countryCode}
						setCountryCode={setCountryCode}
						cinema={cinema}
						setCinema={setCinema}
						cinemaRoomsData={cinemaRoomsData?.data}
						cinemaRoomsError={cinemaRoomsError}
						cinemaRoomsIsLoading={cinemaRoomsIsLoading}
						cinemaRoom={cinemaRoom}
						setCinemaRoom={setCinemaRoom}
						incident={selectedIncident}
						onClose={() => {
							setIncidentModalOpened(false);
							setSelectedIncident(null);
							cinemaRoomIncidentsRefetch();
							enqueueSnackbar("Incident ajouté/mis à jour");
						}}
					/>
				)}
				{cinemaRoomIncidentsData?.meta?.pagination && (
					<Pagination pagination={cinemaRoomIncidentsData?.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />
				)}
			</div>
		</div>
	);
}
