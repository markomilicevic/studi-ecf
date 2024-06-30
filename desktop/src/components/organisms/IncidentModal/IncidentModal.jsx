import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { CinemaRoomList } from "components/molecules/CinemaRoomList";
import { Modal } from "components/molecules/Modal";

const DEFAULT_UNKNOWN_ERROR = "Une erreur est survenue, veuillez réessayer";

const retrieveCinemaRoomIncident = async ({ cinemaRoomId }) => {
	if (!cinemaRoomId) {
		return null;
	}

	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms/incident`, {
		params: {
			cinemaRoomId,
		},
	});
	return response.data;
};

const submitCreate = async (data) => {
	return await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms/incidents`, data);
};

const submitUpdate = async (data) => {
	return await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/rooms/incidents/${encodeURIComponent(data.cinemaRoomIncidentId)}`, data);
};

export default function IncidentModal({
	cinemasData,
	cinemasError,
	cinemasIsLoading,
	countryCode,
	setCountryCode,
	cinema,
	setCinema,
	cinemaRoomsData,
	cinemaRoomsError,
	cinemaRoomsIsLoading,
	cinemaRoom,
	setCinemaRoom,
	incident = null,
	onClose,
}) {
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
	} = useForm({
		defaultValues: {
			cinemaRoomIncidentId: incident?.cinemaRoomIncidentId || null,
			cinemaId: incident?.cinemaId || cinema?.cinemaId || null,
			cinemaRoomId: incident?.cinemaRoomId || cinemaRoom?.cinemaRoomId || null,
			incident: incident?.incident || "",
		},
	});

	const cinemaRoomId = watch("cinemaRoomId");

	const { data: cinemaRoomIncidentData, refetch: cinemaRoomIncidentRefetch } = useQuery(`cinemas-room-incident-${cinemaRoomId}`, () =>
		retrieveCinemaRoomIncident({
			cinemaRoomId: !incident ? cinemaRoom?.cinemaRoomId : undefined,
		})
	);

	useEffect(() => {
		if (cinemaRoomId) {
			cinemaRoomIncidentRefetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, cinemaRoomId);

	useEffect(() => {
		if (cinemaRoomIncidentData?.data) {
			if (window.confirm("Un incident existe déjà pour cette salle, voulez-vous consulter l'incident ?")) {
				onClose();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, cinemaRoomIncidentData);

	const onSubmit = (data) => {
		clearErrors();

		if (!incident) {
			if (!data.cinemaId) {
				setError("form", {
					message: "Veuillez sélectionner un cinéma",
				});
				return;
			}
			if (!data.cinemaRoomId) {
				setError("form", {
					message: "Veuillez sélectionner une salle",
				});
				return;
			}

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
		<Modal open onClose={onClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
			<Box sx={{ background: "white", padding: "20px" }}>
				<form
					action="#"
					method="POST"
					onSubmit={handleSubmit(onSubmit)}
					style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}
				>
					<h1>{!incident ? "Creer un incident sur une salle" : "Modifier un incident sur une salle"}</h1>

					{errors.form && <p>{errors.form.message}</p>}

					{incident ? (
						<div>
							Cinema : {incident.cinemaName}, Salle : {incident.roomNumber}
						</div>
					) : (
						<CinemaRoomList
							cinemasData={cinemasData}
							cinemasError={cinemasError}
							cinemasIsLoading={cinemasIsLoading}
							countryCode={countryCode}
							setCountryCode={(newCountryCode) => {
								setValue("cinemaId", null);
								setValue("cinemaRoomId", null);
								setCountryCode(newCountryCode);
								setCinema(null);
								setCinemaRoom(null);
							}}
							cinema={cinema}
							setCinema={(newCinema) => {
								setValue("cinemaId", newCinema?.cinemaId);
								setValue("cinemaRoomId", null);
								setCinema(newCinema);
								setCinemaRoom(null);
							}}
							cinemaRoomsData={cinemaRoomsData}
							cinemaRoomsError={cinemaRoomsError}
							cinemaRoomsIsLoading={cinemaRoomsIsLoading}
							cinemaRoom={cinemaRoom}
							setCinemaRoom={(newCinemaRoom) => {
								setValue("cinemaRoomId", newCinemaRoom?.cinemaRoomId);
								setCinemaRoom(newCinemaRoom);
							}}
						/>
					)}

					<TextField label="Incident" multiline rows={4} style={{ width: "100%" }} {...register("incident", { required: true })} />
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
				</form>
			</Box>
		</Modal>
	);
}
