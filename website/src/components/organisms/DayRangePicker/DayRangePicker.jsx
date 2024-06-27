import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DayRangePicker({ startDate, endDate, setStartDate, setEndDate }) {
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
			<span>Choisir une période :</span>

			Du 
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<DatePicker value={startDate} onChange={(newStartDate) => setStartDate(newStartDate)} />
			</LocalizationProvider>

			Au
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<DatePicker value={endDate} onChange={(newEndDate) => setEndDate(newEndDate)} />
			</LocalizationProvider>
		</div>
	);
}
