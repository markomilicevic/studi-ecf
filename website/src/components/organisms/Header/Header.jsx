import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

import { Nav } from "./Header.style";

export default function Header() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
			<Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
				<Link to="/" data-testid="header-link-home">
					<h1>Cinéphoria</h1>
				</Link>

				<Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center" }}>
					<Nav>
						<ul style={{ display: "flex", flexDirection: "row", gap: 20 }}>
							<li>
								<NavLink to="/booking" data-testid="header-link-booking">
									Réservation
								</NavLink>
							</li>
							<li>
								<NavLink to="/movies" data-testid="header-link-movies">
									Films
								</NavLink>
							</li>
							<li>
								<NavLink to="/contact" data-testid="header-link-contact">
									Contact
								</NavLink>
							</li>
						</ul>
					</Nav>
				</Box>

				{!isConnected ? (
					<Link to="/account" data-testid="header-link-signin">
						<Button variant="outlined">Se connecter</Button>
					</Link>
				) : (
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
