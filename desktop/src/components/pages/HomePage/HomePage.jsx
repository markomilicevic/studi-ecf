import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SigninForm } from "components/organisms/SigninForm";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function HomePage() {
	const navigate = useNavigate();

	const { flag } = useContext(CurrentUserContext);

	const connect = () => {
		flag(); // Create client's flag

		navigate("/employee"); // Employee
	};

	return (
		<Page data-testid="employee">
			<SigninForm onUserAuthentified={connect} />
		</Page>
	);
}
