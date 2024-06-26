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

import { Pagination } from "components/molecules/Pagination";

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

const retrieveComments = async ({ currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/comments`, {
		params: {
			currentPage,
			perPage,
		},
	});
	return response.data;
};

const submitUpdate = async ({ movieCommentId, status }) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/comments/${movieCommentId}`, {
		status,
	});
};

const ApproveButton = ({ movieCommentId, refetch }) => {
	const { enqueueSnackbar } = useSnackbar();

	const updateComment = useMutation({
		mutationFn: submitUpdate,
	});

	return (
		<Button
			variant="contained"
			size="small"
			onClick={() => {
				updateComment.mutate(
					{ movieCommentId, status: "approved" },
					{
						onSuccess: () => {
							enqueueSnackbar("Commentaire approuvé");
							refetch();
						},
					}
				);
			}}
		>
			Approuver
		</Button>
	);
};

const RejectButton = ({ movieCommentId, refetch }) => {
	const { enqueueSnackbar } = useSnackbar();

	const updateComment = useMutation({
		mutationFn: submitUpdate,
	});

	return (
		<Button
			variant="outlined"
			size="small"
			onClick={() => {
				updateComment.mutate(
					{ movieCommentId, status: "rejected" },
					{
						onSuccess: () => {
							enqueueSnackbar("Commentaire rejeté");
							refetch();
						},
					}
				);
			}}
		>
			Rejeter
		</Button>
	);
};

export default function ModerationCommentList() {
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: commentsData,
		error: commentsError,
		isLoading: commentsIsLoading,
		refetch: commentsRefetch,
	} = useQuery("moderation-movies-comments", () => retrieveComments({ currentPage, perPage: 5 }));

	if (commentsIsLoading) {
		return <div>...</div>;
	}
	if (commentsError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>Commentaires</h1>

			{!commentsData?.data?.length ? (
				<div>Pas de commentaire</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Utilisateur</StyledTableCell>
								<StyledTableCell>Film</StyledTableCell>
								<StyledTableCell>Commentaire</StyledTableCell>
								<StyledTableCell>Statut</StyledTableCell>
								<StyledTableCell>Crée le</StyledTableCell>
								<StyledTableCell>Modifié le</StyledTableCell>
								<StyledTableCell>Actions</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{commentsData.data.map((movieComment) => (
								<StyledTableRow
									key={movieComment.movieCommentId}
									style={{
										fontWeight: movieComment.status === "created" ? "bold" : "inherit",
										textDecoration: movieComment.status === "rejected" ? "line-through" : "inherit",
									}}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<StyledTableCell component="th" scope="row">
										{movieComment.userName}
									</StyledTableCell>
									<StyledTableCell>{movieComment.title}</StyledTableCell>
									<StyledTableCell>{movieComment.comment}</StyledTableCell>
									<StyledTableCell>{movieComment.status}</StyledTableCell>
									<StyledTableCell>{moment(movieComment.createdAt).format("L")}</StyledTableCell>
									<StyledTableCell>{movieComment.updatedAt && moment(movieComment.updatedAt).format("L")}</StyledTableCell>
									<StyledTableCell>
										{movieComment.status === "created" && (
											<>
												<ApproveButton movieCommentId={movieComment.movieCommentId} refetch={commentsRefetch} />{" "}
												<RejectButton movieCommentId={movieComment.movieCommentId} refetch={commentsRefetch} />
											</>
										)}
										{movieComment.status === "approved" && (
											<RejectButton movieCommentId={movieComment.movieCommentId} refetch={commentsRefetch} />
										)}
										{movieComment.status === "rejected" && (
											<ApproveButton movieCommentId={movieComment.movieCommentId} refetch={commentsRefetch} />
										)}
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{commentsData?.meta?.pagination && <Pagination pagination={commentsData?.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />}
		</div>
	);
}
