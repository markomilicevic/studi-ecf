import Rating from "@mui/material/Rating";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

const submitSave = async ({ bookingId, sessionId, movieId, rating }) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/${encodeURIComponent(movieId)}/ratings`, {
		bookingId,
		sessionId,
		rating,
	});
};

export default function SaveRating({ bookingId, sessionId, movieId, rating, onSaved }) {
	const { enqueueSnackbar } = useSnackbar();

	const saveRating = useMutation({
		mutationFn: submitSave,
	});

	const onSubmit = (newRating) => {
		saveRating.mutate(
			{
				bookingId,
				sessionId,
				movieId,
				rating: newRating,
			},
			{
				onSuccess: (response) => {
					if (response?.status === 204) {
						enqueueSnackbar("Votre note a été prise en compte");
						onSaved();
						return;
					}
				},
			}
		);
	};

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
			<strong>Ma note :</strong>
			<Rating
				value={rating}
				onChange={(event, newRating) => {
					onSubmit(newRating);
				}}
			/>
		</div>
	);
}
