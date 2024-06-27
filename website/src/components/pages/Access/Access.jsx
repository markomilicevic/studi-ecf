import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";

import { AccessDetails } from "components/organisms/AccessDetails";
import { Page } from "components/templates/Page";

export default function Access() {
	let { code } = useParams();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Page data-testid="access">
			<div style={{ display: "block", width: isMobile ? "100%" : 400, marginLeft: "auto", marginRight: "auto" }}>
				<AccessDetails code={code} />
			</div>
		</Page>
	);
}
