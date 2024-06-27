import Box from "@mui/material/Box";
import ModalUI from "@mui/material/Modal";

import { ModalClose } from "components/atoms/ModalClose";

export default function Modal({ onClose, children, ...rest }) {
	return (
		<ModalUI className="modal" open onClose={onClose} {...rest}>
			<Box sx={{ backgroundColor: "black" }}>
				<ModalClose onClick={onClose} />
				{children}
			</Box>
		</ModalUI>
	);
}
