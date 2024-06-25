import { Container } from "./ModalClose.style";

export default function ModalClose({ onClick }) {
	return (
		<Container onClick={onClick}>
			<strong>✕</strong>
		</Container>
	);
}
