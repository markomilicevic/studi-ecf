import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, NavLink } from "react-router-dom";

import { Nav } from "./Header.style";

export default function Header() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

				<Link to="/account" data-testid="header-link-signin">
					<Button variant="outlined">Se connecter</Button>
				</Link>
			</Box>
		</header>
	);
}
