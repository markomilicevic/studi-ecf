import { useContext } from "react";

import { AdminNav } from "components/organisms/AdminNav";
import { AdminTicketsChart } from "components/organisms/AdminTicketsChart";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function AdminAnalytics() {
	const { isConnected, data: userData } = useContext(CurrentUserContext);

	if (!isConnected || (userData?.data?.role && userData.data.role !== "admin")) {
		return <Page>Vous n'avez pas accès à cette page</Page>;
	}

	return (
		<Page>
			<AdminNav />
			<hr />
			<AdminTicketsChart />
		</Page>
	);
}
