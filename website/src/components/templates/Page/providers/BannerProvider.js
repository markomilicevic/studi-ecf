import Button from "@mui/material/Button";
import { closeSnackbar, useSnackbar } from "notistack";
import { createContext, useEffect } from "react";

export const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const message = (
			<div style={{ padding: "8px 16px 8px 16px" }}>
				<p>
					Vous êtes sur un site <u>factice</u> conçu dans le cadre d'un exercice
				</p>
				<p>Ce site n'est pas (et ne doit pas) être indexé par des moteurs de recherche</p>
				<p>Ne saisissez pas d'information personnelle ou confidentielle</p>
				<p>
					Ce site se remet à zéro <u>tous les minuits</u> (UTC)
				</p>
			</div>
		);

		const action = (snackbarId) => (
			<Button
				variant="contained"
				size="small"
				onClick={(event) => {
					event.preventDefault();
					closeSnackbar(snackbarId);
				}}
				style={{ marginRight: "24px" }}
			>
				Fermer
			</Button>
		);

		enqueueSnackbar(message, {
			anchorOrigin: {
				vertical: "top",
				horizontal: "center",
			},
			action,
			persist: true,
			preventDuplicate: true,
			key: "banner",
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <BannerContext.Provider value={{}}>{children}</BannerContext.Provider>;
};
