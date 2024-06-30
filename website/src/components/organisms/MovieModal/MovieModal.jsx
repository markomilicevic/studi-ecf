import Grid from "@mui/material/Grid";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { CountryList } from "components/molecules/CountryList";
import { Modal } from "components/molecules/Modal";
import { CommentList } from "components/organisms/CommentList";
import { WeeklySessionList } from "components/organisms/WeeklySessionList";
import { CurrentCinemaContext } from "components/templates/Page/providers/CurrentCinemaProvider";
import { groupSessionsByDay } from "services/utils/sessions";

const DEFAULT_STANDARD_PLACE_NUMBER = 1;
const DEFAULT_DISABLED_PLACE_NUMBER = 0;

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveSessions = async ({ countryCode, movieId }) => {
	if (!countryCode || !movieId) {
		return null;
	}
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions`, {
		params: {
			countryCode,
			movieId,
			standartPlacesNumber: DEFAULT_STANDARD_PLACE_NUMBER,
			disabledPlacesNumber: DEFAULT_DISABLED_PLACE_NUMBER,
		},
	});

	response.data.data = groupSessionsByDay(response.data.data);

	return response.data;
};

export default function MovieModal({ movie, onClose }) {
	const navigate = useNavigate();

	const [preBooking, setPreBooking] = useState({
		countryCode: null,
		movie,
	});

	const { countryCode, setCountryCode, setCinema } = useContext(CurrentCinemaContext);

	const { data: cinemasData, error: cinemasError, isLoading: cinemasIsLoading } = useQuery("movie-modal-cinemas", retrieveCinemas);
	const { data: sessionsData, refetch: sessionsRefetch } = useQuery(`movie-modal-sessions-${preBooking.countryCode}-${preBooking.movie?.movieId}`, () =>
		retrieveSessions({
			countryCode: preBooking.countryCode,
			movieId: preBooking.movie?.movieId,
		})
	);
	useEffect(() => {
		if (countryCode) {
			setPreBooking({ ...preBooking, countryCode });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countryCode]);

	useEffect(() => {
		sessionsRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preBooking.countryCode]);

	const stepChooseCinemaElm = (
		<div>
			<h3>Choisir le pays</h3>
			<CountryList
				data={cinemasData?.data}
				error={cinemasError}
				isLoading={cinemasIsLoading}
				countryCode={countryCode}
				setCountryCode={(newCountryCode) => {
					setCountryCode(newCountryCode);
				}}
			/>
		</div>
	);

	let stepChooseSessionElm;
	if (sessionsData) {
		stepChooseSessionElm = (
			<div style={{ paddingTop: 20 }}>
				<h3>Choisir la scéance</h3>
				<WeeklySessionList
					withCinemaList
					weeklySessions={sessionsData.data}
					session={null}
					setSession={(session) => {
						setCinema(cinemasData?.data?.find((cinema) => cinema.cinemaId === session.cinemaId));

						navigate("/booking", {
							state: { session, movie, standartPlacesNumber: DEFAULT_STANDARD_PLACE_NUMBER, disabledPlacesNumber: DEFAULT_DISABLED_PLACE_NUMBER },
						});
					}}
				/>
			</div>
		);
	}

	return (
		<Modal onClose={onClose} data-testid="movie-modal">
			<Grid container spacing={5}>
				<Grid item xs={12} md={6}>
					<h2 style={{ paddingBottom: 20 }}>{movie.title}</h2>
					{!!movie.rating && (
						<p style={{ paddingBottom: 20 }}>
							Note : <strong>{movie.rating} sur 5</strong>
						</p>
					)}
					<CommentList movieId={movie.movieId} />
				</Grid>
				<Grid item xs={12} md={6}>
					{stepChooseCinemaElm}
					{stepChooseSessionElm}
				</Grid>
			</Grid>
		</Modal>
	);
}
