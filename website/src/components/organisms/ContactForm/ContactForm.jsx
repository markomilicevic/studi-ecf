import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { CurrentCinemaContext } from "components/templates/Page/providers/CurrentCinemaProvider.js";
import { CurrentUserContext } from "components/templates/Page/providers/CurrentUserProvider";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitContact = async ({ userName = null, countryCode = null, cinemaName = null, subject, body }) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/contact`, { userName, countryCode, cinemaName, subject, body });
};

export default function ContactForm() {
	const [isMessageSent, setIsMessageSent] = useState(false);

	const { isConnected, data: userData } = useContext(CurrentUserContext);
	const { countryCode, cinema } = useContext(CurrentCinemaContext);

	const contact = useMutation({
		mutationFn: submitContact,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			userName: isConnected ? userData.data.userName : null,
			countryCode,
			cinemaName: cinema?.cinemaName,
			subject: "",
			body: "",
		},
	});

	const onSubmit = (data) => {
		clearErrors();

		contact.mutate(data, {
			onError: (response) => {
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
			onSuccess: (response) => {
				if (response?.status === 201) {
					setIsMessageSent(true);
					return;
				}
				// Unknown case
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
		});
	};

	if (isMessageSent) {
		return (
			<div style={{ textAlign: "center" }} data-testid="contact-message-sent">
				<strong>Votre message a bien été envoyé</strong>
			</div>
		);
	}

	return (
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} data-testid="contact-form">
			<h1>Contactez nous</h1>

			<div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", paddingTop: 10 }}>
				{errors.form && <p>{errors.form.message}</p>}

				<TextField
					required
					id="contact-subject"
					label="Sujet du message"
					type="text"
					{...register("subject", { required: true })}
					data-testid="contact-form-subject-field"
					error={!!errors.subject}
					helpertext={errors.subject?.message}
				/>

				<TextField
					required
					id="contact-body"
					label="Votre message"
					multiline
					rows={10}
					{...register("body", { required: true })}
					data-testid="contact-form-body-field"
					error={!!errors.body}
					helpertext={errors.body?.message}
				/>

				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
					data-testid="contact-form-submit"
				>
					Envoyer
				</Button>
			</div>
		</form>
	);
}
