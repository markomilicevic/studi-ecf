import Grid from "@mui/material/Grid";

import { SignupForm } from "components/organisms/SignupForm";
import { SigninForm } from "components/organisms/SigninForm";

export default function AccountForm({ connect }) {
	return (
		<Grid container spacing={8}>
			<Grid item xs={12} md={6}>
				<SignupForm onUserCreated={connect} />
			</Grid>
			<Grid item xs={12} md={6}>
				<SigninForm onUserAuthentified={connect} />
			</Grid>
		</Grid>
	);
}
