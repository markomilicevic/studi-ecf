import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitSignup = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users`, data);
};

export default function SignupForm({ onUserCreated }) {
	const signup = useMutation({
		mutationFn: submitSignup,
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
			password: "",
			passwordConfirm: "",
			firstName: "",
			lastName: "",
			userName: "",
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
								case "EMAIL_ALREADY_USED":
									setError("email", {
										message: "Cette adresse email est déjà utilisée, veuillez vous connecter à la place",
									});
									return true;
								case "USER_NAME_ALREADY_USED":
									setError("userName", {
										message: "Ce nom d'utilisateur est déjà utilisée, veuillez en choisir un autre",
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
					onUserCreated();
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
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} data-testid="signup-form">
			<h2>Inscription</h2>

			<div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", paddingTop: 10 }}>
				{errors.form && <p>{errors.form.message}</p>}

				<TextField
					required
					id="signup-form-email"
					label="Votre adresse email"
					defaultValue="john.doe@example.com"
					type="email"
					{...register("email", { required: true, pattern: /^.+@.+$/ })}
					data-testid="signup-form-email-field"
					error={!!errors.email}
					helperText={errors.email?.message}
				/>
				<TextField
					required
					id="signup-form-password"
					label="Choisir un mot de passe"
					type="password"
					{...register("password", { required: true })}
					data-testid="signup-form-password-field"
					error={!!errors.password}
					helperText={errors.password?.message}
				/>
				<TextField
					required
					id="signup-form-password-confirm"
					label="Saisir à nouveau le mot de passe"
					type="password"
					{...register("passwordConfirm", { required: true })}
					data-testid="signup-form-confirm-password-field"
					error={!!errors.passwordConfirm}
					helperText={errors.passwordConfirm?.message}
				/>
				<TextField
					required
					id="signup-form-last-name"
					label="Votre nom"
					type="text"
					{...register("lastName", { required: true })}
					data-testid="signup-form-last-name-field"
					error={!!errors.lastName}
					helperText={errors.lastName?.message}
				/>
				<TextField
					required
					id="signup-form-first-name"
					label="Votre prénom"
					type="text"
					{...register("firstName", { required: true })}
					data-testid="signup-form-first-name-field"
					error={!!errors.firstName}
					helperText={errors.firstName?.message}
				/>
				<TextField
					required
					id="signup-form-user-name"
					label="Choisir un pseudonyme"
					type="text"
					{...register("userName", { required: true })}
					data-testid="signup-form-user-name-field"
					error={!!errors.userName}
					helperText={errors.userName?.message}
				/>
				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
					data-testid="signup-form-submit"
				>
					S'inscrire
				</Button>
			</div>
		</form>
	);
}
