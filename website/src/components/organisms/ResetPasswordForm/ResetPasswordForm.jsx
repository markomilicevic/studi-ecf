import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitResetPassword = async ({ resetPasswordToken, password }) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/password`, { resetPasswordToken, password });
};

export default function ResetPasswordForm({ resetPasswordToken, onPasswordResetted }) {
	const signup = useMutation({
		mutationFn: submitResetPassword,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			resetPasswordToken,
			password: "",
			passwordConfirm: "",
		},
	});

	const onSubmit = (data) => {
		let isValid = true;
		const password = data.password;
		const passwordConfirm = data.passwordConfirm;

		clearErrors();

		// Min 8 characters including at least:
		// - One lower case
		// - One upper case
		// - One special
		// - One digit
		if (password.length < MIN_PASSWORD_LENGTH) {
			setError("password", {
				message: "Le mot de passe doit faire au moins 8 caractères",
			});
			isValid = false;
		} else if (!/[A-Z]+/.test(password)) {
			setError("password", {
				message: "Le mot de passe doit contenir au moins une majuscule",
			});
			isValid = false;
		} else if (!/[a-z]+/.test(password)) {
			setError("password", {
				message: "Le mot de passe doit contenir au moins une minuscule",
			});
			isValid = false;
		} else if (!/\W+/.test(password)) {
			setError("password", { message: "Le mot de passe doit contenir au moins un caractère special" });
			isValid = false;
		} else if (!/[0-9]+/.test(password)) {
			setError("password", {
				message: "Le mot de passe doit contenir au moins un chiffre",
			});
			isValid = false;
		}

		if (passwordConfirm !== password) {
			setError("passwordConfirm", {
				message: "Le mot de passe doit être le même",
			});
			isValid = false;
		}

		if (!isValid) {
			// One or several form error
			return;
		}

		signup.mutate(data, {
			onError: (response) => {
				let errorCatched = false;
				if (response?.response.status === 400) {
					errorCatched =
						(response?.response?.data?.errors || []).filter((error) => {
							switch (error) {
								case "INVALID_RESET_PASSWORD_TOKEN":
									setError("form", {
										message: "Ce lien de changement de mot de passe ne fonctionne plus, veuillez demander un nouveau lien",
									});
									return true;
								default:
									return false;
							}
						}).length > 0;
				}
				if (!errorCatched) {
					setError("form", {
						message: DEFAULT_UNKNOWN_ERROR,
					});
				}
			},
			onSuccess: (response) => {
				if (response?.status === 201) {
					onPasswordResetted();
					return;
				}
				// Unknown case
				setError("form", {
					message: DEFAULT_UNKNOWN_ERROR,
				});
			},
		});
	};

	return (
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} data-testid="reset-password-form">
			<h2>Changer le mot de passe</h2>

			<div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", paddingTop: 10 }}>
				{errors.form && <p>{errors.form.message}</p>}

				<TextField
					required
					id="reset-password-new-password"
					label="Choisir un mot de passe"
					type="password"
					{...register("password", { required: true })}
					data-testid="reset-password-form-password-field"
					error={!!errors.password}
					helpertext={errors.password?.message}
				/>

				<TextField
					required
					id="reset-password-new-password-confirm"
					label="Saisir à nouveau le mot de passe"
					type="password"
					{...register("passwordConfirm", { required: true })}
					data-testid="reset-password-new-password-confirm"
					error={!!errors.passwordConfirm}
					helpertext={errors.passwordConfirm?.message}
				/>
				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
					data-testid="signin-form-submit"
				>
					Mettre à jour le mon mot de passe
				</Button>
			</div>
		</form>
	);
}
