import Button from "@mui/material/Button";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DayPicker({ day, setDay }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
			<span>Choisir une date :</span>

			<LocalizationProvider dateAdapter={AdapterMoment}>
				<DatePicker label="Sans préférence" disablePast value={day} onChange={(newDay) => setDay(newDay)} />
			</LocalizationProvider>

			{day && (
				<Button variant="contained" onClick={() => setDay(null)}>
					Toutes les dates
				</Button>
			)}
		</div>
	);
}
