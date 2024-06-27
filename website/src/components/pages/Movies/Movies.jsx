import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { CinemaList } from "components/organisms/CinemaList";
import { DayPicker } from "components/organisms/DayPicker";
import { GenreList } from "components/organisms/GenreList";
import { MovieListCard } from "components/organisms/MovieListCard";
import { Page } from "components/templates/Page";
import { CurrentCinemaContext } from "components/templates/Page/providers/CurrentCinemaProvider";

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveGenres = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/genres`);
	return response.data;
};

const retrieveMovies = async ({ cinemaId, genreId, day }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`, {
		params: {
			cinemaId,
			genreId,
			day,
		},
	});
	return response.data;
};

export default function Movies() {
	const [filters, setFilters] = useState({});

	const { countryCode, setCountryCode, cinema, setCinema } = useContext(CurrentCinemaContext);

	const { data: cinemasData } = useQuery("cinemas", retrieveCinemas);
	const { data: genresData } = useQuery("genres", retrieveGenres);
	const {
		data: moviesData,
		error: moviesError,
		isLoading: moviesIsLoading,
		refetch: moviesRefetch,
	} = useQuery("movies-movies", () =>
		retrieveMovies({
			cinemaId: filters.cinema?.cinemaId || undefined,
			genreId: filters.genre?.genreId || undefined,
			day: filters.day ? moment(filters.day).format("YYYY-MM-DD") : undefined,
		})
	);

	useEffect(() => {
		moviesRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	return (
		<Page data-testid="movies">
			<div style={{ display: "flex", justifyContent: "center", paddingBottom: 30 }}>
				<h2>Tous les films</h2>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				<CinemaList
					data={cinemasData?.data}
					countryCode={countryCode}
					setCountryCode={(countryCode) => {
						setCountryCode(countryCode);
						setFilters({ ...filters, countryCode });
					}}
					cinema={cinema}
					setCinema={(cinema) => {
						setCinema(cinema);
						setFilters({ ...filters, ...{ cinema } });
					}}
				/>

				<GenreList data={genresData?.data} genre={filters.genre} setGenre={(genre) => setFilters({ ...filters, ...{ genre } })} />

				<DayPicker day={filters.day} setDay={(day) => setFilters({ ...filters, day })} />
			</div>
			<div style={{ marginTop: 50 }}>
				<MovieListCard data={moviesData} error={moviesError} isLoading={moviesIsLoading} />
			</div>
		</Page>
	);
}
