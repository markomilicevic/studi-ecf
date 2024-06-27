import axios from "axios";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";

import { Modal } from "components/molecules/Modal";

const retrieveAccess = async ({ bookingId }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/booking/${bookingId}/access`);
	return response.data;
};

export default function OrderAccessModal({ order, onClose }) {
	const { data: accessData } = useQuery("access", () => retrieveAccess({ bookingId: order.bookingId }));

	return (
		<Modal
			onClose={onClose}
			data-testid="order-access-modal"
			style={{ display: "block", position: "absolute", top: "50%", left: "50%", marginLeft: -150, marginTop: -125, width: 300 }}
		>
			<div
				style={{
					backgroundColor: "white",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					height: 300,
				}}
			>
				{!!accessData?.data?.code && (
					<>
						<h2 style={{ color: "#444", fontSize: 20, marginBottom: 10 }}>Votre QR Code</h2>
						<QRCode value={accessData.data.code} size={200} />
						<h3 style={{ color: "#999", marginTop: 10, fontSize: 13, fontStyle: "italic" }}>À presenter le jour de la scéance</h3>
					</>
				)}
			</div>
		</Modal>
	);
}
