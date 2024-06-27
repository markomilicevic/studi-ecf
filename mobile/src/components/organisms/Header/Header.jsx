import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function Header() {
	const navigate = useNavigate();
	const { isConnected, data: userData, signout } = useContext(CurrentUserContext);

	const doSignout = () => {
		signout((err, success) => {
			if (success) {
				navigate("/"); // HomePage
			}
		});
	};

	return (
		<header data-testid="header">
			<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
				<Link to="/" data-testid="header-link-home">
					<h1>Cinéphoria</h1>
				</Link>

				{isConnected && (
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
						Bonjour {userData?.data?.userName}
						<Button variant="outlined" onClick={doSignout} data-testid="header-link-signout">
							Se déconnecter
						</Button>
					</div>
				)}
			</Box>
		</header>
	);
}
