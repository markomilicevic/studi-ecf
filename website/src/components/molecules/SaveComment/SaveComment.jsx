import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitSave = async ({ bookingId, sessionId, movieId, comment }) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/${encodeURIComponent(movieId)}/comments`, {
		bookingId,
		sessionId,
		comment,
	});
};

export default function SaveComment({ bookingId, sessionId, movieId, comment, onSaved }) {
	const [isReadMode, setIsReadMode] = useState(true);

	const { enqueueSnackbar } = useSnackbar();

	const saveComment = useMutation({
		mutationFn: submitSave,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			bookingId,
			sessionId,
			movieId,
			comment,
		},
	});

	const onSubmit = (data) => {
		clearErrors();

		saveComment.mutate(data, {
			onError: (response) => {
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
			onSuccess: (response) => {
				if (response?.status === 204) {
					enqueueSnackbar("Commentaire envoyé, il sera visible au publique après sa modération");
					setIsReadMode(true);
					onSaved();
					return;
				}
				// Unknown case
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
		});
	};

	if (isReadMode) {
		return !comment ? (
			<Button variant="contained" size="small" onClick={() => setIsReadMode(false)}>
				Ajouter un commentaire
			</Button>
		) : (
			<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
				<strong>Mon commentairer :</strong>
				<span>{comment}</span>
				<Button variant="contained" size="small" onClick={() => setIsReadMode(false)}>
					Modifier
				</Button>
			</div>
		);
	}

	return (
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
			{errors.form && <p>{errors.form.message}</p>}
			<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
				<TextField required id={`comment-${movieId}`} type="text" {...register("comment", { required: true })} label="Mon commentaire" />{" "}
				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
				>
					Soumettre
				</Button>{" "}
				<Button variant="outlined" onClick={() => setIsReadMode(true)}>
					Annuler
				</Button>
			</div>
		</form>
	);
}
