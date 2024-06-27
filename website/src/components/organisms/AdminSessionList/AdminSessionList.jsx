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
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { Pagination } from "components/molecules/Pagination";
import { AdminSessionModal } from "components/organisms/AdminSessionModal";

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

const retrieveSessions = async ({ currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions`, {
		params: {
			currentPage,
			perPage,
		},
	});
	return response.data;
};

const submitDelete = async ({ sessionId }) => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions/${sessionId}`);
};

export default function AdminSessionList() {
	const [currentPage, setCurrentPage] = useState(1);
	const [adminSessionModalOpened, setAdminSessionModalOpened] = useState(false);
	const [selectedSession, setSelectedSession] = useState();

	const { enqueueSnackbar } = useSnackbar();

	const {
		data: sessionsData,
		error: sessionsError,
		isLoading: sessionsIsLoading,
		refetch: sessionsRefetch,
	} = useQuery("admin-sessions", () => retrieveSessions({ currentPage, perPage: 5 }));

	const deleteSession = useMutation({
		mutationFn: submitDelete,
	});

	useEffect(() => {
		sessionsRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	if (sessionsIsLoading) {
		return <div>...</div>;
	}
	if (sessionsError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>
				Scéances{" "}
				<Button
					variant="contained"
					onClick={() => {
						setSelectedSession(null);
						setAdminSessionModalOpened(true);
					}}
				>
					Ajouter
				</Button>
			</h1>

			{!sessionsData?.data?.length ? (
				<div>Pas de scéance</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Date de début</StyledTableCell>
								<StyledTableCell>Date de fin</StyledTableCell>
								<StyledTableCell>Nom du cinéma</StyledTableCell>
								<StyledTableCell>Numéro de salle</StyledTableCell>
								<StyledTableCell>Titre du film</StyledTableCell>
								<StyledTableCell>Qualité</StyledTableCell>
								<StyledTableCell>Crée le</StyledTableCell>
								<StyledTableCell>Modifié le</StyledTableCell>
								<StyledTableCell>Actions</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{sessionsData.data.map((session) => (
								<StyledTableRow key={session.sessionsId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<StyledTableCell component="th" scope="row">
										{moment(session.startDate).format("L HH:mm:ss")}
									</StyledTableCell>
									<StyledTableCell>{moment(session.endDate).format("L HH:mm:ss")}</StyledTableCell>
									<StyledTableCell>{session.cinemaName}</StyledTableCell>
									<StyledTableCell>{session.roomNumber}</StyledTableCell>
									<StyledTableCell>{session.title}</StyledTableCell>
									<StyledTableCell>{session.qualityName}</StyledTableCell>
									<StyledTableCell>{moment(session.createdAt).format("L")}</StyledTableCell>
									<StyledTableCell>{session.updatedAt && moment(session.updatedAt).format("L")}</StyledTableCell>
									<StyledTableCell>
										<Button
											variant="contained"
											size="small"
											onClick={() => {
												setSelectedSession(session);
												setAdminSessionModalOpened(true);
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
														`Êtes-vous sûr de supprimer la scéance du ${moment(session.startDate).format("L HH:mm:ss")} pour le film "${session.title}" ?`
													)
												) {
													deleteSession.mutate(
														{ sessionId: session.sessionId },
														{
															onSuccess: () => {
																sessionsRefetch();
																enqueueSnackbar("Scéance supprimée");
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
			{sessionsData?.meta?.pagination && <Pagination pagination={sessionsData?.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />}
			{adminSessionModalOpened && (
				<AdminSessionModal
					session={selectedSession}
					onClose={() => {
						setAdminSessionModalOpened(false);
						setSelectedSession(null);
						sessionsRefetch();
					}}
				/>
			)}
		</div>
	);
}
