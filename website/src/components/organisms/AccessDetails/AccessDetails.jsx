import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import moment from "moment";
import { useQuery } from "react-query";

const retrieveAccessDetails = async ({ code }) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/booking/accesses/${encodeURIComponent(code)}`);
		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export default function AccessDetails({ code }) {
	const { data: accessDetailsData, isLoading: accessDetailsIsLoading } = useQuery("access-details", () => retrieveAccessDetails({ code }));

	if (!accessDetailsData?.data) {
		if (!accessDetailsIsLoading) {
			return (
				<TableContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Statut</TableCell>
								<TableCell>❌ Invalide</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Conseil</TableCell>
								<TableCell>Le client doit se rendre à l'accueil</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			);
		}
		return null;
	}

	return (
		<TableContainer>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Statut</TableCell>
						<TableCell>✅ Valide</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Film</TableCell>
						<TableCell>{accessDetailsData.data.title}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Début scéance</TableCell>
						<TableCell>{moment(accessDetailsData.data.startDate).format("LLL")}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>N° places</TableCell>
						<TableCell>{accessDetailsData.data.reservedPlacementNumbers.join(", ")}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
