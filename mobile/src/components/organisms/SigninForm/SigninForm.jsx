import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitSignin = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/auth`, data);
};

export default function SigninForm({ onUserAuthentified }) {
	const signin = useMutation({
		mutationFn: submitSignin,
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
		},
	});

	const onSubmit = (data) => {
		clearErrors();

		signin.mutate(data, {
			onError: (response) => {
				let errorMessage;
				if (response?.response?.status === 401) {
					if (response?.response?.data?.errors?.some((error) => error === "WRONG_CREDENTIALS")) {
						errorMessage = "Mauvais email / mot de passe";
					}
				}
				setError("form", {
					message: errorMessage || DEFAULT_UNKNOWN_ERROR,
				});
			},
			onSuccess: (response) => {
				if (response?.status === 200) {
					onUserAuthentified();
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
		<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} data-testid="signin-form">
			<h2>Connexion mobile</h2>

			<div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", paddingTop: 10 }}>
				{errors.form && <p>{errors.form.message}</p>}

				<TextField
					required
					id="signin-form-email"
					label="Votre adresse email"
					defaultValue="john.doe@example.com"
					type="email"
					{...register("email", { required: true, pattern: /^.+@.+$/ })}
					data-testid="signin-form-email-field"
					error={!!errors.email}
					helperText={errors.email?.message}
				/>
				<TextField
					required
					id="signin-form-password"
					label="Votre mot de passe"
					type="password"
					{...register("password", { required: true })}
					data-testid="signin-form-password-field"
					error={!!errors.password}
					helperText={errors.password?.message}
				/>
				<Button
					variant="contained"
					type="submit"
					onClick={() => {
						clearErrors();
					}}
					data-testid="signin-form-submit"
				>
					Se connecter
				</Button>
			</div>
		</form>
	);
}
