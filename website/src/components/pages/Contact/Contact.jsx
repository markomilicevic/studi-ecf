import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ContactForm } from "components/organisms/ContactForm";
import { Page } from "components/templates/Page";

export default function Account() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Page data-testid="contact">
			<div style={{ display: "block", width: isMobile ? "100%" : 600, marginLeft: "auto", marginRight: "auto" }}>
				<ContactForm />
			</div>
		</Page>
	);
}
