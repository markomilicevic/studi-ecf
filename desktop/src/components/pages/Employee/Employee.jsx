import { useContext } from "react";

import IncidentList from "components/organisms/IncidentList/IncidentList";
import Page from "components/templates/Page/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function Employee() {
	const { isConnected, data: userData } = useContext(CurrentUserContext);

	if (!isConnected || (userData?.data?.role && userData.data.role !== "employee")) {
		return <Page>Vous n'avez pas accès à cette page</Page>;
	}

	return (
		<Page>
			<IncidentList />
		</Page>
	);
}
