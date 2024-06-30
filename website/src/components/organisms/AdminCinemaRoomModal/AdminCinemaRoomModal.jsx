import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { Modal } from "components/molecules/Modal";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveQualities = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/qualities`);
	return response.data;
};

const submitCreate = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/${data.cinemaId}/rooms`, data);
};

const submitUpdate = async (data) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/${data.cinemaId}/rooms/${data.cinemaRoomId}`, data);
};

export default function AdminCinemaRoomModal({ cinemaRoom = null, onClose }) {
	const { data: cinemasData, isLoading: cinemasIsLoading } = useQuery("admin-cinemas", retrieveCinemas);
	const { data: qualitiesData, isLoading: qualitiesIsLoading } = useQuery("admin-qualities", retrieveQualities);

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
			cinemaId: cinemaRoom?.cinemaId || null,
			cinemaRoomId: cinemaRoom?.cinemaRoomId || null,
			qualityId: cinemaRoom?.qualityId || null,
			roomNumber: cinemaRoom?.roomNumber || null,
			placementsMatrix: cinemaRoom?.placementsMatrix || "",
		},
	});

	const onSubmit = (data) => {
		clearErrors();

		if (!cinemaRoom) {
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

	if (cinemasIsLoading || qualitiesIsLoading) {
		return <span>...</span>;
	}

	return (
		<Modal open onClose={onClose}>
			<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
				<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
					<h1>{!cinemaRoom ? "Ajouter une salle de cinéma" : "Modifier une salle de cinéma"}</h1>

					{errors.form && <p>{errors.form.message}</p>}

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Cinéma</InputLabel>
							<Select
								label="Selectionner le cinéma"
								defaultValue={watch("cinemaId")}
								{...register("cinemaId", { required: true })}
								error={!!errors.cinemaId}
								helpertext={errors.cinemaId?.message}
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
							<InputLabel>Qualité de projection</InputLabel>
							<Select
								label="Selectionner la qualité de projection"
								defaultValue={watch("qualityId")}
								{...register("qualityId", { required: true })}
								error={!!errors.qualityId}
								helpertext={errors.qualityId?.message}
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
						label="Numéro de salle"
						type="number"
						{...register("roomNumber", { required: true })}
						error={!!errors.roomNumber}
						helpertext={errors.roomNumber?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Placements"
						type="text"
						multiline
						maxRows={4}
						{...register("placementsMatrix", { required: true })}
						error={!!errors.placementsMatrix}
						helpertext={errors.placementsMatrix?.message}
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
