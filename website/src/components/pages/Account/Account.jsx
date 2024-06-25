import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AccountForm } from "components/organisms/AccountForm";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function Account() {
	const navigate = useNavigate();

	const { flag } = useContext(CurrentUserContext);

	const connect = () => {
		flag(); // Create client's flag

		navigate("/"); // HomePage
	};

	return (
		<Page data-testid="account">
			<AccountForm connect={connect} />
		</Page>
	);
}
