import { useContext } from "react";

import { AdminCinemaRoomList } from "components/organisms/AdminCinemaRoomList";
import { AdminMovieList } from "components/organisms/AdminMovieList";
import { AdminSessionList } from "components/organisms/AdminSessionList";
import { ModerationCommentList } from "components/organisms/ModerationCommentList";
import { Page } from "components/templates/Page";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

export default function Admin() {
	const { isConnected, data: userData } = useContext(CurrentUserContext);

	if (!isConnected || (userData?.data?.role && userData.data.role !== "employee")) {
		return <Page>Vous n'avez pas accès à cette page</Page>;
	}

	return (
		<Page>
			<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
				<AdminMovieList />
				<AdminSessionList />
				<AdminCinemaRoomList />
				<ModerationCommentList />
			</div>
		</Page>
	);
}
