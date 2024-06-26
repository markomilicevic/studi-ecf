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

import { AdminCinemaRoomModal } from "components/organisms/AdminCinemaRoomModal";
import { countTotalNumberOfPlacements, isValidPlacementsMatrix } from "services/utils/placementsMatrix";

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

const retrieveCinemaRooms = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms`);
	return response.data;
};

const submitDelete = async ({ cinemaId, cinemaRoomId }) => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/${cinemaId}/rooms/${cinemaRoomId}`);
};

export default function AdminCinemaRoomList() {
	const [adminCinemaRoomModalOpened, setAdminCinemaRoomModalOpened] = useState(false);
	const [selectedCinemaRoom, setSelectedCinemaRoom] = useState();

	const { enqueueSnackbar } = useSnackbar();

	const {
		data: cinemaRoomsData,
		error: cinemaRoomsError,
		isLoading: cinemaRoomsIsLoading,
		refetch: cinemaRoomsRefetch,
	} = useQuery("admin-cinema-rooms", retrieveCinemaRooms);

	const deleteCinemaRoom = useMutation({
		mutationFn: submitDelete,
	});

	if (cinemaRoomsIsLoading) {
		return <div>...</div>;
	}
	if (cinemaRoomsError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>
				Salles de cinémas{" "}
				<Button
					variant="contained"
					onClick={() => {
						setSelectedCinemaRoom(null);
						setAdminCinemaRoomModalOpened(true);
					}}
				>
					Ajouter
				</Button>
			</h1>

			{!cinemaRoomsData?.data?.length ? (
				<div>Pas de salle</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Pays</StyledTableCell>
								<StyledTableCell>Cinéma</StyledTableCell>
								<StyledTableCell>Numéro de salle</StyledTableCell>
								<StyledTableCell>Nombre total de places</StyledTableCell>
								<StyledTableCell>Qualité de projection</StyledTableCell>
								<StyledTableCell>Crée le</StyledTableCell>
								<StyledTableCell>Modifié le</StyledTableCell>
								<StyledTableCell>Actions</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{cinemaRoomsData.data.map((cinemaRoom) => (
								<StyledTableRow key={cinemaRoom.cinemaRoomId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<StyledTableCell component="th" scope="row">
										{cinemaRoom.countryCode}
									</StyledTableCell>
									<StyledTableCell>{cinemaRoom.cinemaName}</StyledTableCell>
									<StyledTableCell>{cinemaRoom.roomNumber}</StyledTableCell>
									<StyledTableCell>
										{isValidPlacementsMatrix(cinemaRoom.placementsMatrix) ? (
											countTotalNumberOfPlacements(cinemaRoom.placementsMatrix)
										) : (
											<strong style={{ color: "red" }}>Placements invalide</strong>
										)}
									</StyledTableCell>
									<StyledTableCell>{cinemaRoom.qualityName}</StyledTableCell>
									<StyledTableCell>{moment(cinemaRoom.createdAt).format("L")}</StyledTableCell>
									<StyledTableCell>{cinemaRoom.updatedAt && moment(cinemaRoom.updatedAt).format("L")}</StyledTableCell>
									<StyledTableCell>
										<Button
											variant="contained"
											size="small"
											onClick={() => {
												setSelectedCinemaRoom(cinemaRoom);
												setAdminCinemaRoomModalOpened(true);
											}}
										>
											Editer
										</Button>{" "}
										<Button
											variant="outlined"
											size="small"
											onClick={() => {
												if (
													window.confirm(
														`Êtes-vous sûr de supprimer la salle ${cinemaRoom.roomNumber} du cinéma "${cinemaRoom.cinemaName}" ?`
													)
												) {
													deleteCinemaRoom.mutate(
														{ cinemaId: cinemaRoom.cinemaId, cinemaRoomId: cinemaRoom.cinemaRoomId },
														{
															onSuccess: () => {
																cinemaRoomsRefetch();
																enqueueSnackbar("Salle de cinéma supprimée");
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
			{adminCinemaRoomModalOpened && (
				<AdminCinemaRoomModal
					cinemaRoom={selectedCinemaRoom}
					onClose={() => {
						setAdminCinemaRoomModalOpened(false);
						setSelectedCinemaRoom(null);
						cinemaRoomsRefetch();
					}}
				/>
			)}
		</div>
	);
}
