import styled from "styled-components";

export const Layout = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	background: rgb(2, 0, 36);
	background: radial-gradient(circle, rgba(2, 0, 36, 1) 0%, rgba(8, 34, 38, 1) 38%, rgba(6, 39, 46, 1) 80%, rgba(15, 51, 65, 1) 91%);
`;

export const ContentLayout = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-left: 200px;
	margin-right: 200px;

	@media only screen and (max-width: 900px) {
		margin-left: 20px;
		margin-right: 20px;
	}
`;
