import { Chart as ReactGoogleChart } from "react-google-charts";

export default function Chart({ data, width, height }) {
	const formattedData =
		data?.map((row, index) => {
			if (index === 0) {
				const header = [{ type: "date", label: "Jour" }];
				for (let i = 1; i < row.length; i++) {
					header.push({ type: "number", label: row[i] });
				}
				return header;
			} else {
				// Requiring Date object
				row[0] = new Date(row[0]);
				return row;
			}
		}) || [];
	const options = {
		legend: { position: "bottom" },
		hAxis: {
			format: "dd-MM-yyyy",
		},
	};
	return <ReactGoogleChart chartType="ColumnChart" width={width} height={height} data={formattedData} options={options} />;
}
