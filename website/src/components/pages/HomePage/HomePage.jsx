import axios from "axios";
import { useQuery } from "react-query";

import { MovieListCard } from "components/organisms/MovieListCard";
import { Page } from "components/templates/Page";

const retrieveActiveMovies = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/actives`);
	return response.data;
};

export default function HomePage() {
	const { data: activeMoviesData, error: activeMoviesError, isLoading: activeMoviesIsLoading } = useQuery("active-movies", retrieveActiveMovies);

	return (
		<Page data-testid="homepage">
			<div style={{ display: "flex", justifyContent: "center", paddingBottom: 30 }}>
				<h2>Films de la semaine</h2>
			</div>
			<MovieListCard data={activeMoviesData} error={activeMoviesError} isLoading={activeMoviesIsLoading} />
		</Page>
	);
}
