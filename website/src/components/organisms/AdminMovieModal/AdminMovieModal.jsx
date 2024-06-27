import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { Modal } from "components/molecules/Modal";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const retrieveGenres = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/genres`);
	return response.data;
};

const submitPoster = async ({ image }) => {
	const formData = new FormData();
	formData.append("image", image);

	const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/poster`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

const submitCreate = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies`, data);
};

const submitUpdate = async (data) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/${data.movieId}`, data);
};

export default function AdminMovieModal({ movie = null, onClose }) {
	const { data: genresData } = useQuery("genres", retrieveGenres);

	const uploadPoster = useMutation({
		mutationFn: submitPoster,
	});

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
		setValue,
		clearErrors,
		watch,
		control,
	} = useForm({
		defaultValues: {
			movieId: movie?.movieId || null,
			title: movie?.title || null,
			posterId: movie?.posterId || null,
			genreId: movie?.genreId || null,
			description: movie?.description || null,
			minimalAge: movie?.minimalAge || null,
			isHighlight: movie?.isHightlight === true,
		},
	});

	const onChangePoster = (event) => {
		if (!event?.target?.files?.[0]) {
			return;
		}

		uploadPoster.mutate(
			{ image: event.target.files[0] },
			{
				onError: (response) => {
					let errorMessages = [];
					if (response?.response?.status === 400) {
						errorMessages = (response.response.data?.errors || []).map((error) => {
							switch (error) {
								case "WRONG_EXTENSION":
									return "Mauvaise extension de fichier (.jpg uniquement accepté)";
								case "WRONG_MIMETYPE":
									return "Mauvaise type de fichier (JPEG uniquement accepté)";
								case "TOO_BIG_FILESIZE":
									return "Fichier trop lourd (max 5MB)";
								default:
									return DEFAULT_UNKNOWN_ERROR;
							}
						});
					}
					setError("posterId", {
						message: errorMessages.length ? errorMessages.join(", ") : DEFAULT_UNKNOWN_ERROR,
					});
				},
				onSuccess: (response) => {
					if (response?.data?.posterId) {
						setValue("posterId", response.data.posterId);
						return;
					}
					// Unknown case
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				},
			}
		);
	};

	const onSubmit = (data) => {
		clearErrors();

		if (!movie) {
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

	return (
		<Modal onClose={onClose}>
			<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
				<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
					<h1>{!movie ? "Ajouter un film" : "Modifier un film"}</h1>

					{errors.form && <p>{errors.form.message}</p>}

					<TextField
						required
						label="Titre du film"
						type="text"
						{...register("title", { required: true })}
						error={!!errors.title}
						helperText={errors.title?.message}
						style={{ width: "100%" }}
					/>
					<div>
						<label for="posterId">Affiche du film :</label>
						<div style={{ display: "flex" }}>
							{watch("posterId") && <img src={`${process.env.REACT_APP_STATIC_BASE_URL}/posters/${watch("posterId")}.jpg`} width="50" alt="" />}

							<TextField required id="posterId" type="text" {...register("posterId", { required: true })} style={{ width: "100%" }} />
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<span>Changer l'affiche :</span>
							<TextField name="poster" type="file" accept="image/jpeg" onChange={onChangePoster} style={{ width: "50%" }} />
						</div>
						{errors.posterId && <p>{errors.posterId.message}</p>}
					</div>

					<Box sx={{ minWidth: 250 }}>
						<FormControl fullWidth>
							<InputLabel>Genre du film</InputLabel>
							<Select
								label="Selectionner le genre"
								defaultValue={watch("genreId")}
								{...register("genreId", { required: true })}
								error={!!errors.genreId}
								helperText={errors.genreId?.message}
							>
								{genresData?.data?.map((genre) => (
									<MenuItem key={genre.genreId} value={genre.genreId}>
										{genre.genreName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<TextField
						required
						label="Description du film"
						type="text"
						multiline
						maxRows={4}
						{...register("description", { required: true })}
						error={!!errors.description}
						helperText={errors.description?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Age minimal"
						type="number"
						{...register("minimalAge", { required: true })}
						error={!!errors.minimalAge}
						helperText={errors.minimalAge?.message}
						style={{ width: "100%" }}
					/>

					<FormGroup>
						<FormControlLabel
							control={<Controller name="isHighlight" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />}
							label="Coup de coeur"
							style={{ width: "100%" }}
						/>
					</FormGroup>

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
