import styled from "styled-components";

export const Container = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 50px;
	height: 50px;
	background-color: white;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	strong {
		font-size: 30px;
		color: black;
	}

	&:hover {
		opacity: 0.75;
	}
`;
