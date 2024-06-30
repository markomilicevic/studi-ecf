import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import moment from "moment";
import { useState } from "react";

import { DailySessionList } from "components/molecules/DailySessionList";

export default function WeeklySessionList({ withCinemaList = false, weeklySessions, session, setSession }) {
	const [startIndex, setStartIndex] = useState(0);
	if (!weeklySessions?.length) {
		return <div data-testid="weekly-session-list-no-session">Pas de scéance</div>;
	}
	const firstDayDate = moment(weeklySessions[0][0].startDate).format("YYYY-MM-DD");

	return (
		<div data-testid="weekly-session-list">
			<FormControl>
				<RadioGroup aria-labelledby="weekly-session-list-radio-buttons-group-label" name="weekly-session-list-radio-buttons-group"></RadioGroup>
				<ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
					{Array(7)
						.fill(null)
						.map((_, index) => (
							<ol data-testid="weekly-session-list-day" key={`${startIndex + index}-${session?.sessionId}`}>
								<DailySessionList
									withCinemaList={withCinemaList}
									firstDayDate={firstDayDate}
									currentDayIndex={startIndex + index}
									dailySessions={weeklySessions[startIndex + index]}
									selectedSession={session}
									setSelectedSession={setSession}
								/>
							</ol>
						))}
				</ul>
			</FormControl>

			<div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, gap: 20 }}>
				<div>
					{startIndex > 0 && (
						<Button
							variant="contained"
							data-testid="weekly-session-list-previous-navigation"
							onClick={() => setStartIndex(Math.max(0, startIndex - 7))}
						>
							Semaine précédente
						</Button>
					)}
				</div>
				<div>
					{weeklySessions.length > 7 && startIndex < weeklySessions.length - 1 && (
						<Button
							variant="contained"
							data-testid="weekly-session-list-next-navigation"
							onClick={() => setStartIndex(Math.min(weeklySessions.length, startIndex + 7))}
						>
							Semaine suivante
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
