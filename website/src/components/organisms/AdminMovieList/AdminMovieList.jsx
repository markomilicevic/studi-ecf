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

import { AdminMovieModal } from "components/organisms/AdminMovieModal";

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

const retrieveMovies = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`);
	return response.data;
};

const submitDelete = async ({ movieId }) => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/${movieId}`);
};

export default function AdminMovieList() {
	const [adminMovieModalOpened, setAdminMovieModalOpened] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState();

	const { enqueueSnackbar } = useSnackbar();

	const { data: moviesData, error: moviesError, isLoading: moviesIsLoading, refetch: moviesRefetch } = useQuery("movies", retrieveMovies);

	const deleteMovie = useMutation({
		mutationFn: submitDelete,
	});

	if (moviesIsLoading) {
		return <div>...</div>;
	}
	if (moviesError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>
				Films{" "}
				<Button
					variant="contained"
					size="small"
					onClick={() => {
						setSelectedMovie(null);
						setAdminMovieModalOpened(true);
					}}
				>
					Ajouter
				</Button>
			</h1>

			{!moviesData?.data?.length ? (
				<div>No movie</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Titre du film</StyledTableCell>
								<StyledTableCell>Crée le</StyledTableCell>
								<StyledTableCell>Modifié le</StyledTableCell>
								<StyledTableCell>Actions</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{moviesData.data.map((movie) => (
								<StyledTableRow key={movie.movieId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<StyledTableCell component="th" scope="row">
										{movie.title}
									</StyledTableCell>
									<StyledTableCell>{moment(movie.createdAt).format("L")}</StyledTableCell>
									<StyledTableCell>{movie.updatedAt && moment(movie.updatedAt).format("L")}</StyledTableCell>
									<StyledTableCell>
										<Button
											variant="contained"
											size="small"
											onClick={() => {
												setSelectedMovie(movie);
												setAdminMovieModalOpened(true);
											}}
										>
											Editer
										</Button>{" "}
										<Button
											variant="outlined"
											size="small"
											onClick={() => {
												if (window.confirm(`Êtes-vous sûr de supprimer le film "${movie.title}" ?`)) {
													deleteMovie.mutate(
														{ movieId: movie.movieId },
														{
															onSuccess: () => {
																moviesRefetch();
																enqueueSnackbar("Film supprimé");
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
			{adminMovieModalOpened && (
				<AdminMovieModal
					movie={selectedMovie}
					onClose={() => {
						setAdminMovieModalOpened(false);
						setSelectedMovie(null);
						moviesRefetch();
					}}
				/>
			)}
		</div>
	);
}
