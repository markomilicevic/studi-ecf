import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";

import { ResetPasswordForm } from "components/organisms/ResetPasswordForm";
import { Page } from "components/templates/Page";

export default function Account() {
	let { resetPasswordToken } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Page data-testid="account-reset">
			<div style={{ display: "block", width: isMobile ? "100%" : 400, marginLeft: "auto", marginRight: "auto" }}>
				<ResetPasswordForm
					resetPasswordToken={resetPasswordToken}
					onPasswordResetted={() => {
						navigate("/account");
					}}
				/>
			</div>
		</Page>
	);
}
