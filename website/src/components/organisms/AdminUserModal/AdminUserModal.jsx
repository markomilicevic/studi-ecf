import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { Modal } from "components/molecules/Modal";

const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const submitCreate = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users`, data);
};

const submitUpdate = async (data) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/${data.userId}`, data);
};

export default function AdminUserModal({ role, user = null, onClose }) {
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
	} = useForm({
		defaultValues: {
			role,
			userId: user?.userId || null,
			firstName: user?.firstName || null,
			lastName: user?.lastName || null,
			userName: user?.userName || null,
			email: user?.email || null,
			password: null,
			passwordConfirm: null,
		},
	});

	const onSubmit = (data) => {
		let isValid = true;
		const password = data.password;
		const passwordConfirm = data.passwordConfirm;

		clearErrors();

		let mustSetPassword = !user || password?.length;

		if (mustSetPassword) {
			// Min 8 characters including at least:
			// - One lower case
			// - One upper case
			// - One special
			// - One digit
			if (password.length && password.length < MIN_PASSWORD_LENGTH) {
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
		}

		if (!isValid) {
			// One or several form error
			return;
		}

		const onError = (response) => {
			let errorCatched = false;
			if (response?.response.status === 400) {
				errorCatched =
					(response?.response?.data?.errors || []).filter((error) => {
						switch (error) {
							case "EMAIL_ALREADY_USED":
								setError("email", {
									message: "Cette adresse email est déjà utilisée par un autre utilisateur",
								});
								return true;
							case "USER_NAME_ALREADY_USED":
								setError("userName", {
									message: "Ce nom d'utilisateur est déjà utilisée par un autre utilisateur",
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
		};

		if (!user) {
			create.mutate(data, {
				onError,
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
				onError,
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
		<Modal open onClose={onClose}>
			<form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
				<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
					<h1>{!user ? `Ajouter un ${role}` : `Modifier un ${role}`}</h1>

					{errors.form && <p>{errors.form.message}</p>}

					<TextField
						required
						label="Adresse email"
						type="text"
						{...register("email", { required: true, pattern: /^.+@.+$/ })}
						error={!!errors.email}
						helperText={errors.email?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required={!user}
						label="Choisir un mot de passe"
						type="password"
						{...register("password", { required: !user })}
						error={!!errors.password}
						helperText={errors.password?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required={!user}
						label="Saisir à nouveau le mot de passe"
						type="password"
						{...register("passwordConfirm", { required: !user })}
						error={!!errors.passwordConfirm}
						helperText={errors.passwordConfirm?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Nom"
						type="text"
						{...register("lastName", { required: true })}
						error={!!errors.lastName}
						helperText={errors.lastName?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Prénom"
						type="text"
						{...register("firstName", { required: true })}
						error={!!errors.firstName}
						helperText={errors.firstName?.message}
						style={{ width: "100%" }}
					/>

					<TextField
						required
						label="Pseudonyme"
						type="text"
						{...register("userName", { required: true })}
						error={!!errors.userName}
						helperText={errors.userName?.message}
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
