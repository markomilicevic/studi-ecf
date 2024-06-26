import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Chart } from "components/molecules/Chart";
import { DayRangePicker } from "components/organisms/DayRangePicker";
import { MovieListDropdown } from "components/organisms/MovieListDropdown";

const retrieveMovies = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`);
	return response.data;
};

const retrieveMetrics = async ({ startDate, endDate, movieId = null }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/analytics/tickets`, {
		params: {
			startDate: new moment(startDate).format("YYYY-MM-DD"),
			endDate: new moment(endDate).format("YYYY-MM-DD"),
			movieId,
		},
	});
	return response.data;
};

export default function AdminTicketsChart() {
	const currentDate = new Date();
	const [filters, setFilters] = useState({
		defaultDatesChanged: false,
		startDate: moment(currentDate).subtract(7, "d"),
		endDate: moment(currentDate),
		movie: null,
	});

	const { data: moviesData, error: moviesError, isLoading: moviesIsLoading } = useQuery("movies", retrieveMovies);

	const {
		data: metricsData,
		error: metricsError,
		isLoading: metricsIsLoading,
		refetch: metricsRefetch,
	} = useQuery("admin-analytics-metrics", () =>
		retrieveMetrics({
			startDate: filters.startDate,
			endDate: filters.endDate,
			movieId: filters.movie?.movieId || undefined,
		})
	);

	useEffect(() => {
		if (metricsData?.data) {
			metricsRefetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	if (metricsIsLoading) {
		return <div>...</div>;
	}
	if (metricsError) {
		return <div>Une erreur est survenue</div>;
	}

	return (
		<div>
			<h1>
				{!filters.defaultDatesChanged ? "Ventes de tickets par film sur les 7 derniers jours" : "Ventes de tickets par jour et par film avec filtres"}
			</h1>
			<div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px", marginBottom: "20px" }}>
				<DayRangePicker
					startDate={filters.startDate}
					endDate={filters.endDate}
					setStartDate={(newStartDate) => setFilters({ ...filters, startDate: newStartDate, defaultDatesChanged: true })}
					setEndDate={(newEndDate) => setFilters({ ...filters, endDate: newEndDate, defaultDatesChanged: true })}
				/>
				<MovieListDropdown
					data={moviesData?.data}
					error={moviesError}
					isLoading={moviesIsLoading}
					movie={filters.movie}
					setMovie={(newMovie) => setFilters({ ...filters, movie: newMovie, defaultDatesChanged: true })}
				/>
			</div>
			{metricsData?.data?.length ? <Chart data={metricsData.data} width="100%" height="50vh" /> : <div>Aucune donnée</div>}
		</div>
	);
}
