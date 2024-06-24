import Button from "@mui/material/Button";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import { CinemaList } from "components/organisms/CinemaList";
import { MovieListDropdown } from "components/organisms/MovieListDropdown";
import { Placements } from "components/organisms/Placements";
import { PlacesNumber } from "components/organisms/PlacesNumber";
import { WeeklySessionList } from "components/organisms/WeeklySessionList";
import { Page } from "components/templates/Page";
import { CurrentCinemaContext } from "components/templates/Page/providers/CurrentCinemaProvider.js";
import { groupSessionsByDay } from "services/utils/sessions";

// TODO: Adapt this to the P95 of number of places by booking
const DEFAULT_STANDART_PLACES_NUMBER = 2;

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveMovies = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`);
	return response.data;
};

const retrieveSessions = async ({ cinemaId, movieId, standartPlacesNumber, disabledPlacesNumber }) => {
	if (!cinemaId || !movieId || (standartPlacesNumber === 0 && disabledPlacesNumber === 0)) {
		return null;
	}
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions`, {
		params: {
			cinemaId,
			movieId,
			standartPlacesNumber,
			disabledPlacesNumber,
		},
	});

	response.data.data = groupSessionsByDay(response.data.data);

	return response.data;
};

const retrieveSession = async ({ sessionId }) => {
	if (!sessionId) {
		return null;
	}
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions/${encodeURIComponent(sessionId)}`);
	if (!response?.data) {
		throw new Error("Failed to retrieve session");
	}
	return response.data;
};

const retrieveBookingVerify = async ({ sessionId, choicedPlaces }) => {
	if (!sessionId || !choicedPlaces?.length) {
		return null;
	}
	const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/booking/verify`, {
		sessionId,
		choicedPlaces,
	});
	if (!response?.data) {
		throw new Error("Failed to retrieve booking verify");
	}
	return response.data;
};

export default function Booking() {
	let location = useLocation();

	const [booking, setBooking] = useState({
		cinema: null,
		movie: null,
		placements: {
			totalPlacesNumber: DEFAULT_STANDART_PLACES_NUMBER,
			standartPlacesNumber: 0,
			disabledPlacesNumber: 0,
			numberOfPlacesSelected: false,
			choicedPlaces: [],
		},
		session: null,
	});

	const { countryCode, setCountryCode, cinema, setCinema } = useContext(CurrentCinemaContext);

	const { data: cinemasData, error: cinemasError, isLoading: cinemasIsLoading } = useQuery("cinemas", retrieveCinemas);
	const { data: moviesData, error: moviesError, isLoading: moviesIsLoading } = useQuery("active-movies", retrieveMovies);
	const { data: sessionsData, refetch: sessionsRefetch } = useQuery("booking-sessions", () =>
		retrieveSessions({
			cinemaId: booking.cinema?.cinemaId,
			movieId: booking.movie?.movieId,
			standartPlacesNumber: !booking.placements.numberOfPlacesSelected ? 0 : booking.placements.standartPlacesNumber,
			disabledPlacesNumber: !booking.placements.numberOfPlacesSelected ? 0 : booking.placements.disabledPlacesNumber,
		})
	);
	const { data: sessionData, refetch: sessionRefetch } = useQuery("booking-session", () =>
		retrieveSession({
			sessionId: booking.session?.sessionId,
		})
	);
	const { data: bookVerifyData, refetch: bookVerifyRefetch } = useQuery("booking-verify", () =>
		retrieveBookingVerify({
			sessionId: booking.session?.sessionId,
			choicedPlaces: booking.placements.choicedPlaces.length === booking.placements.totalPlacesNumber ? booking.placements.choicedPlaces : 0,
		})
	);

	useEffect(() => {
		if (cinema) {
			setBooking({ ...booking, cinema });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cinema]);

	useEffect(() => {
		sessionsRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [booking.cinema?.cinemaId, booking.movie?.movieId, booking.placements.numberOfPlacesSelected]);

	useEffect(() => {
		sessionRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [booking.session?.sessionId]);

	useEffect(() => {
		bookVerifyRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [booking.placements.choicedPlaces]);

	useEffect(() => {
		if (!location.state || !cinemasData?.data?.length || !moviesData?.data?.length) {
			return;
		}

		const cinema = cinemasData.data.find((cinema) => cinema.cinemaId === location.state.session.cinemaId);
		const movie = moviesData.data.find((movie) => movie.movieId === location.state.session.movieId);

		if (!cinema || !movie) {
			return;
		}

		setBooking({
			...booking,
			cinema: { ...cinema },
			movie: { ...movie },
			placements: {
				...booking.placements,
				totalPlacesNumber: location.state.standartPlacesNumber + location.state.disabledPlacesNumber,
				standartPlacesNumber: location.state.standartPlacesNumber,
				disabledPlacesNumber: location.state.disabledPlacesNumber,
				numberOfPlacesSelected: true,
			},
			session: { ...location.state.session },
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, cinemasData, moviesData]);

	if (cinemasError || moviesError) {
		return <Page>Erreur survenue</Page>;
	}
	if (cinemasIsLoading || moviesIsLoading) {
		return <Page>Chargement...</Page>;
	}

	const stepChooseCinemaElm = (
		<div>
			<h2>Choisir le cinéma</h2>
			<CinemaList
				data={cinemasData?.data}
				countryCode={countryCode}
				setCountryCode={setCountryCode}
				cinema={cinema}
				setCinema={(cinema) => {
					setCinema(cinema);
					setBooking({ ...booking, movie: null });
				}}
			/>
		</div>
	);

	let stepChooseMovieElm;
	if (booking.cinema?.cinemaId) {
		stepChooseMovieElm = (
			<div>
				<h2>Choisir le film</h2>
				<MovieListDropdown data={moviesData?.data} movie={booking.movie} setMovie={(movie) => setBooking({ ...booking, ...{ movie } })} />
			</div>
		);
	}

	let stepChoosePlacesNumberElm;
	if (booking.movie?.movieId) {
		stepChoosePlacesNumberElm = (
			<div>
				<h2>Choisir le nombre de places</h2>
				<div style={{ display: "flex", gap: 20 }}>
					<PlacesNumber
						placements={booking.placements}
						setPlacements={(placements) => {
							setBooking({
								...booking,
								placements: {
									...placements,
									standartPlacesNumber: 0,
									numberOfPlacesSelected: false,
								},
							});
						}}
					/>
					<Button
						variant="contained"
						onClick={() => {
							setBooking({
								...booking,
								placements: {
									...booking.placements,
									standartPlacesNumber: booking.placements.totalPlacesNumber - booking.placements.disabledPlacesNumber,
									numberOfPlacesSelected: true,
								},
							});
						}}
						data-testid="places-number-submit"
					>
						Voir les scéances disponibles
					</Button>
				</div>
			</div>
		);
	}

	let stepChooseSessionElm;
	if (sessionsData) {
		stepChooseSessionElm = (
			<div>
				<h1>Choisir la scéance</h1>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<WeeklySessionList
						weeklySessions={sessionsData?.data}
						session={booking.session}
						setSession={(session) => setBooking({ ...booking, ...{ session } })}
					/>
				</div>
			</div>
		);
	}

	let stepChoosePlacesElm;
	if (sessionData) {
		stepChoosePlacesElm = (
			<div>
				<h2>{booking.placements.totalPlacesNumber > 1 ? "Choisir les places" : "Choisir la place"}</h2>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Placements
						placementsMatrix={sessionData?.data?.placementsMatrix}
						reservedPlacementNumbers={sessionData?.data?.reservedPlacementNumbers}
						standartPlacesNumber={booking.placements.standartPlacesNumber}
						disabledPlacesNumber={booking.placements.disabledPlacesNumber}
						onChange={(placeNumber, isSelected) => {
							setBooking({
								...booking,
								placements: {
									...booking.placements,
									choicedPlaces: isSelected
										? [...booking.placements.choicedPlaces, placeNumber]
										: [...booking.placements.choicedPlaces].filter((pn) => pn !== placeNumber),
								},
							});
						}}
					/>
				</div>
			</div>
		);
	}

	let stepSeePriceElm;
	if (bookVerifyData) {
		stepSeePriceElm = (
			<div data-testid="booking-finalize">
				<h2>Prix total</h2>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 40 }}>
					Total: {bookVerifyData.data?.totalPriceValue} {bookVerifyData.data?.totalPriceUnit}
				</div>
			</div>
		);
	}

	return (
		<Page data-testid="booking">
			<div style={{ display: "flex", justifyContent: "center", paddingBottom: 30 }}>
				<h2>Réservation</h2>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				{stepChooseCinemaElm}
				{stepChooseMovieElm}
				{stepChoosePlacesNumberElm}
				{stepChooseSessionElm}
				{stepChoosePlacesElm}
				{stepSeePriceElm}
			</div>
		</Page>
	);
}
