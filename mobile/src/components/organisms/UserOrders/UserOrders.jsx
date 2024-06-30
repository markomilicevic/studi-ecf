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
import { useState } from "react";
import { useQuery } from "react-query";

import { Pagination } from "components/molecules/Pagination";
import { OrderAccessModal } from "components/organisms/OrderAccessModal";

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

	"&:hover": {
		cursor: "pointer",
		backgroundColor: " black",
	},
}));

const retrieveOrders = async ({ startDay, currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/booking/orders`, {
		params: {
			startDay,
			currentPage,
			perPage,
		},
	});
	return response.data;
};

export default function UserOrders() {
	const [currentPage, setCurrentPage] = useState(1);
	const [orderAccessModalOpened, setOrderAccessModalOpened] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState();

	const {
		data: ordersData,
		error: ordersError,
		isLoading: ordersIsLoading,
	} = useQuery("user-orders", () => retrieveOrders({ startDay: new Date().toISOString(), currentPage, perPage: 10 }));

	if (ordersIsLoading) {
		return <div>...</div>;
	}
	if (ordersError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			{!ordersData?.data?.length ? (
				<div>Pas de séance</div>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Scéances</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ordersData.data.map((order) => (
								<StyledTableRow
									key={order.bookingId}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									onClick={() => {
										setSelectedOrder(order);
										setOrderAccessModalOpened(true);
									}}
								>
									<StyledTableCell>
										<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
											<img
												alt={order.title}
												height="200"
												src={`${process.env.REACT_APP_STATIC_BASE_URL}/posters/${order.posterId}.jpg`}
											/>
											<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
												<strong>Film : {order.title}</strong>
												<Button variant="outlined">Voir QR Code</Button>
												<span>Jour de projection : {moment(order.startDate).format("LL")}</span>
												<span>N° places : {order.reservedPlacementNumbers.join(", ")}</span>
												<span>Commence le : {moment(order.startDate).format("LLL")}</span>
												<span>Fini le : {moment(order.endDate).format("LLL")}</span>
											</div>
										</div>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{ordersData?.meta?.pagination && <Pagination pagination={ordersData?.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />}
			{orderAccessModalOpened && (
				<OrderAccessModal
					order={selectedOrder}
					onClose={() => {
						setOrderAccessModalOpened(false);
						setSelectedOrder(null);
					}}
				/>
			)}
		</div>
	);
}
