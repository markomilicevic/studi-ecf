import { useContext } from "react";

import { UserOrders } from "components/organisms/UserOrders";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function User() {
	const { isConnected, data: userData } = useContext(CurrentUserContext);

	if (!isConnected || (userData?.data?.role && userData.data.role !== "user")) {
		return <Page>Vous n'avez pas accès à cette page</Page>;
	}

	return (
		<Page>
			<UserOrders />
		</Page>
	);
}
