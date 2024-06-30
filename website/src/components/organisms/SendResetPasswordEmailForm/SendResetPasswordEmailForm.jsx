import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitSendResetPasswordEmail = async ({ email }) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/password`, { email });
};

export default function SendResetPasswordEmailForm() {
	const [isEmailSent, setIsEmailSent] = useState(false);

	const sendResetPasswordEmail = useMutation({
		mutationFn: submitSendResetPasswordEmail,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (data) => {
		clearErrors();

		sendResetPasswordEmail.mutate(data, {
			onSuccess: (response) => {
				if (response?.status === 201) {
					setIsEmailSent(true);
					return;
				}
				// Unknown case
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
		});
	};

	if (isEmailSent) {
		return <strong>Si cette adresse email est déjà inscrite alors vous allez recevoir un email très prochainement</strong>;
	}

	return (
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} data-testid="send-reset-password-email-form">
			<h2>Réinitialiser le mot de passe</h2>

			<div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", paddingTop: 10 }}>
				{errors.form && <p>{errors.form.message}</p>}

				<TextField
					required
					id="send-reset-password-email-field"
					label="Votre adresse email"
					defaultValue="john.doe@example.com"
					type="email"
					{...register("email", { required: true, pattern: /^.+@.+$/ })}
					data-testid="signup-form-email-field"
					error={!!errors.email}
					helpertext={errors.email?.message}
				/>
				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
					data-testid="send-reset-password-email-form-submit"
				>
					Changer le mot de passe
				</Button>
			</div>
		</form>
	);
}
