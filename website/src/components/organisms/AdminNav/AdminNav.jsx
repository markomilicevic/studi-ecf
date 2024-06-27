import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AdminNav() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center" }}>
			<nav>
				<ul style={{ display: "flex", flexDirection: "row", gap: 20 }}>
					<li>
						<NavLink to="/admin">Gestion</NavLink>
					</li>
					<li>
						<NavLink to="/admin/analytics">Analytics</NavLink>
					</li>
				</ul>
			</nav>
		</Box>
	);
}
