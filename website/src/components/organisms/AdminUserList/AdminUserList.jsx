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

import { AdminUserModal } from "components/organisms/AdminUserModal";

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

const retrieveUsers = async ({ role }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users`, {
		params: {
			role,
		},
	});
	return response.data;
};

const submitDelete = async ({ userId }) => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/${userId}`);
};

export default function AdminUserList({ role }) {
	const [adminUserModalOpened, setAdminUserModalOpened] = useState(false);
	const [selectedUser, setSelectedUser] = useState();

	const { enqueueSnackbar } = useSnackbar();

	const { data: usersData, error: usersError, isLoading: usersIsLoading, refetch: usersRefetch } = useQuery("admin-users", () => retrieveUsers({ role }));

	const deleteUser = useMutation({
		mutationFn: submitDelete,
	});

	if (usersIsLoading) {
		return <div>...</div>;
	}
	if (usersError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>
				Employés{" "}
				<Button
					variant="contained"
					onClick={() => {
						setSelectedUser(null);
						setAdminUserModalOpened(true);
					}}
				>
					Ajouter
				</Button>
			</h1>

			{!usersData?.data?.length ? (
				<div>Pas d'employé</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Nom</StyledTableCell>
								<StyledTableCell>Prénom</StyledTableCell>
								<StyledTableCell>Nom d'utilisateur</StyledTableCell>
								<StyledTableCell>Email</StyledTableCell>
								<StyledTableCell>Crée le</StyledTableCell>
								<StyledTableCell>Modifié le</StyledTableCell>
								<StyledTableCell>Actions</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{usersData.data.map((user) => (
								<StyledTableRow key={user.userId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<StyledTableCell component="th" scope="row">
										{user.lastName}
									</StyledTableCell>
									<StyledTableCell>{user.firstName}</StyledTableCell>
									<StyledTableCell>{user.userName}</StyledTableCell>
									<StyledTableCell>{user.email}</StyledTableCell>
									<StyledTableCell>{moment(user.createdAt).format("L")}</StyledTableCell>
									<StyledTableCell>{user.updatedAt && moment(user.updatedAt).format("L")}</StyledTableCell>
									<StyledTableCell>
										<Button
											variant="contained"
											size="small"
											onClick={() => {
												setSelectedUser(user);
												setAdminUserModalOpened(true);
											}}
										>
											Editer
										</Button>{" "}
										<Button
											variant="outlined"
											size="small"
											onClick={() => {
												if (window.confirm(`Êtes-vous sûr de supprimer "${user.lastName} ${user.firstName}" ?`)) {
													deleteUser.mutate(
														{ userId: user.userId },
														{
															onSuccess: () => {
																usersRefetch();
																enqueueSnackbar("Utilisateur supprimé");
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
			{adminUserModalOpened && (
				<AdminUserModal
					role={role}
					user={selectedUser}
					onClose={() => {
						setAdminUserModalOpened(false);
						setSelectedUser(null);
						usersRefetch();
					}}
				/>
			)}
		</div>
	);
}
