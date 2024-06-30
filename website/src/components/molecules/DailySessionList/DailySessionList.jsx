import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import moment from "moment";
import { useCallback } from "react";

export default function DailySessionList({ withCinemaList = false, firstDayDate, currentDayIndex, dailySessions, selectedSession, setSelectedSession }) {
	const currentDate = moment(firstDayDate).add(currentDayIndex, "days");

	let dateToDisplay;
	if (currentDate.isSame(moment(), "day")) {
		dateToDisplay = <span data-testid="daily-session-list-its-today">Aujourd'hui</span>;
	} else if (currentDate.isSame(moment().add(1, "days"), "day")) {
		dateToDisplay = <span data-testid="daily-session-list-its-tomorrow">Demain</span>;
	} else {
		dateToDisplay = <span data-testid="daily-session-list-its-a-day">{currentDate.format("L")}</span>;
	}

	const List = useCallback(() => {
		if (withCinemaList) {
			return (
				<ul>
					{dailySessions.map((session) => (
						<ol data-testid="daily-session-list-session" key={session.sessionId}>
							<a
								href="/movies"
								onClick={(event) => {
									event.preventDefault();
									setSelectedSession(session);
								}}
								data-testid="daily-session-list-select-session"
							>
								<u>
									{moment(session.startDate).format("LLLL")} - {session.cinemaName} ({session.qualityName} - {session.priceValue}{" "}
									{session.priceUnit} / place)
								</u>
							</a>
						</ol>
					))}
				</ul>
			);
		}

		return (
			<ul>
				{dailySessions.map((session) => (
					<ol data-testid="daily-session-list-session" key={session.sessionId}>
						<FormControlLabel
							value={session.sessionId}
							checked={session.sessionId === selectedSession?.sessionId}
							control={<Radio />}
							label={
								<span>
									{moment(session.startDate).format("LLLL")} ({session.qualityName} - {session.priceValue} {session.priceUnit} / place)
								</span>
							}
							onChange={(event) => {
								if (event.target.checked) {
									setSelectedSession(session);
								}
							}}
							data-testid="daily-session-list-select-session"
							style={{ textDecoration: "underline" }}
						/>
					</ol>
				))}
			</ul>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dailySessions]);

	return (
		<div>
			{dateToDisplay}
			{!dailySessions?.length ? (
				<div data-testid="daily-session-list-no-session" style={{ color: "rgba(255, 255, 255, 0.3)" }}>
					Pas de scéance
				</div>
			) : (
				<List />
			)}
		</div>
	);
}
