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
import { useState } from "react";
import { useQuery } from "react-query";

import { Pagination } from "components/molecules/Pagination";
import { SaveComment } from "components/molecules/SaveComment";
import { SaveRating } from "components/molecules/SaveRating";

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

const retrieveOrders = async ({ currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/booking/orders`, {
		params: {
			currentPage,
			perPage,
		},
	});
	return response.data;
};

export default function UserOrders() {
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: ordersData,
		error: ordersError,
		isLoading: ordersIsLoading,
		refetch: ordersRefetch,
	} = useQuery("user-orders", () => retrieveOrders({ currentPage, perPage: 5 }));

	if (ordersIsLoading) {
		return <div>...</div>;
	}
	if (ordersError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "center", paddingBottom: 30 }}>
				<h2>Commandes</h2>
			</div>

			{!ordersData?.data?.length ? (
				<div>Pas encore de commande</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Date commande</StyledTableCell>
								<StyledTableCell>Film</StyledTableCell>
								<StyledTableCell>Date scéance</StyledTableCell>
								<StyledTableCell align="right">Nbr de places</StyledTableCell>
								<StyledTableCell align="right">Prix total</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ordersData.data.map((order) => (
								<StyledTableRow key={order.bookingId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<StyledTableCell component="th" scope="row">
										{moment(order.bookingAt).format("LLL")}
									</StyledTableCell>
									<StyledTableCell>
										<div>{order.title}</div>
										{moment(new Date()).isAfter(moment(order.endDate)) && (
											<div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "10px" }}>
												<SaveRating
													bookingId={order.bookingId}
													sessionId={order.sessionId}
													movieId={order.movieId}
													rating={order.rating}
													onSaved={ordersRefetch}
												/>
												<SaveComment
													bookingId={order.bookingId}
													sessionId={order.sessionId}
													movieId={order.movieId}
													comment={order.comment}
													onSaved={ordersRefetch}
												/>
											</div>
										)}
									</StyledTableCell>
									<StyledTableCell>{moment(order.startDate).format("LLL")}</StyledTableCell>
									<StyledTableCell align="right">{order.totalPlacesNumber}</StyledTableCell>
									<StyledTableCell align="right">
										{order.totalPriceValue} {order.totalPriceUnit}
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{ordersData?.meta?.pagination && <Pagination pagination={ordersData?.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />}
		</div>
	);
}
