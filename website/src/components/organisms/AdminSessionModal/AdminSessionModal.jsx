import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { Modal } from "components/molecules/Modal";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveCinemaRooms = async ({ cinemaId }) => {
	if (!cinemaId) {
		return null;
	}
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/${encodeURIComponent(cinemaId)}/rooms`);
	return response.data;
};

const retrieveMovies = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`);
	return response.data;
};

const retrieveQualities = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/qualities`);
	return response.data;
};

const submitCreate = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions`, data);
};

const submitUpdate = async (data) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/sessions/${data.sessionId}`, data);
};

export default function AdminSessionModal({ session = null, onClose }) {
	console.log(session);
	const { data: cinemasData, isLoading: cinemasIsLoading } = useQuery("cinemas", retrieveCinemas);
	const {
		data: cinemaRoomsData,
		isLoading: cinemaRoomsIsLoading,
		refetch: cinemaRoomsRefetch,
	} = useQuery("admin-cinema-rooms", () =>
		retrieveCinemaRooms({
			cinemaId: watch("cinemaId") || undefined,
		})
	);
	const { data: moviesData, isLoading: moviesIsLoading } = useQuery("movies", retrieveMovies);
	const { data: qualitiesData, isLoading: qualitiesIsLoading } = useQuery("qualities", retrieveQualities);

	const create = useMutation({
		mutationFn: submitCreate,
	});

	const update = useMutation({
		mutationFn: submitUpdate,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
		watch,
	} = useForm({
		defaultValues: {
			sessionId: session?.sessionId || null,
			cinemaId: session?.cinemaId || null,
			cinemaRoomId: session?.cinemaRoomId || null,
			movieId: session?.movieId || null,
			qualityId: session?.qualityId || null,
			startDate: session?.startDate || null,
			endDate: session?.endDate || null,
			standartFreePlaces: session?.standartFreePlaces || null,
			disabledFreePlaces: session?.disabledFreePlaces || null,
		},
	});

	const cinemaId = watch("cinemaId");

	useEffect(() => {
		cinemaRoomsRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cinemaId]);

	const onSubmit = (data) => {
		clearErrors();

		if (!session) {
			create.mutate(data, {
				onError: () => {
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				},
				onSuccess: (response) => {
					if (response?.status === 201) {
						onClose();
						return;
					}
					// Unknown case
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				},
			});
		} else {
			update.mutate(data, {
				onError: () => {
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				},
				onSuccess: (response) => {
					if (response?.status === 204) {
						onClose();
						return;
					}
					// Unknown case
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				},
			});
		}
	};

	if (cinemasIsLoading || cinemaRoomsIsLoading || moviesIsLoading || qualitiesIsLoading) {
		return <span>Loading...</span>;
	}

	return (
		<Modal onClose={onClose}>
			<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
				<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
					<h1>{!session ? "Ajouter une scéance" : "Modifier une scéance"}</h1>

					{errors.form && <p>{errors.form.message}</p>}

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Cinéma</InputLabel>
							<Select
								label="Selectionner le cinéma"
								defaultValue={watch("cinemaId")}
								{...register("cinemaId", { required: true })}
								error={!!errors.cinemaId}
								helperText={errors.cinemaId?.message}
							>
								{cinemasData?.data?.map((cinema) => (
									<MenuItem key={cinema.cinemaId} value={cinema.cinemaId}>
										{cinema.cinemaName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Numéro de salle</InputLabel>
							<Select
								label="Selectionner la salle"
								defaultValue={watch("cinemaRoomId")}
								{...register("cinemaRoomId", { required: true })}
								error={!!errors.cinemaRoomId}
								helperText={errors.cinemaRoomId?.message}
							>
								{cinemaRoomsData?.data?.map((cinemaRoom) => (
									<MenuItem key={cinemaRoom.cinemaRoomId} value={cinemaRoom.cinemaRoomId}>
										{cinemaRoom.roomNumber}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Film</InputLabel>
							<Select
								label="Selectionner le film"
								defaultValue={watch("movieId")}
								{...register("movieId", { required: true })}
								error={!!errors.movieId}
								helperText={errors.movieId?.message}
							>
								{moviesData?.data?.map((movie) => (
									<MenuItem key={movie.movieId} value={movie.movieId}>
										{movie.title}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Qualité</InputLabel>
							<Select
								label="Selectionner la qualité"
								defaultValue={watch("qualityId")}
								{...register("qualityId", { required: true })}
								error={!!errors.qualityId}
								helperText={errors.qualityId?.message}
							>
								{qualitiesData?.data?.map((quality) => (
									<MenuItem key={quality.qualityId} value={quality.qualityId}>
										{quality.qualityName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<TextField
						required
						label="Date et heure de début"
						type="text"
						{...register("startDate", { required: true })}
						error={!!errors.startDate}
						helperText={errors.startDate?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Date et heure de fin"
						type="text"
						{...register("endDate", { required: true })}
						error={!!errors.endDate}
						helperText={errors.endDate?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Nombre de places standarts"
						type="number"
						{...register("standartFreePlaces", { required: true })}
						error={!!errors.standartFreePlaces}
						helperText={errors.standartFreePlaces?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Nombre de places handicapées"
						type="number"
						{...register("disabledFreePlaces", { required: true })}
						error={!!errors.disabledFreePlaces}
						helperText={errors.disabledFreePlaces?.message}
						style={{ width: "100%" }}
					/>

					<div>
						<Button
							variant="contained"
							type="submit"
							onClick={() => {
								clearErrors();
							}}
						>
							Valider
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
}
