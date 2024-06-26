import { useContext } from "react";

import { AdminMovieList } from "components/organisms/AdminMovieList";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function Admin() {
	const { isConnected, data: userData } = useContext(CurrentUserContext);

	if (!isConnected || (userData?.data?.role && userData.data.role !== "admin")) {
		return <Page>Vous n'avez pas accès à cette page</Page>;
	}

	return (
		<Page>
			<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
				<AdminMovieList />
			</div>
		</Page>
	);
}
