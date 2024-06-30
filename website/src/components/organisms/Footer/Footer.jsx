import { useContext } from "react";
import { Link } from "react-router-dom";

import { CinemaList } from "components/organisms/CinemaList";
import { CurrentCinemaContext } from "components/templates/Page/providers/CurrentCinemaProvider";

export default function Footer() {
	const {
		data: cinemasData,
		error: cinemasError,
		isLoading: cinemasIsLoading,
		countryCode,
		setCountryCode,
		cinema,
		setCinema,
	} = useContext(CurrentCinemaContext);

	return (
		<footer data-testid="footer">
			<CinemaList
				data={cinemasData?.data}
				error={cinemasError}
				isLoading={cinemasIsLoading}
				countryCode={countryCode}
				setCountryCode={setCountryCode}
				cinema={cinema}
				setCinema={setCinema}
				showDetails
			/>
			<div style={{ paddingTop: 32, textAlign: "center" }}>
				&copy; {new Date().getFullYear()} Marko Milicevic - Tous droits réservés -{" "}
				<Link to="/tos" data-testid="footer-link-tos">
					<u>Conditions Générales d'Utilisation</u>
				</Link>{" "}
				-{" "}
				<a href="https://github.com/markomilicevic/studi-ecf" target="_blank" rel="noreferrer">
					<u>Code source</u>
				</a>
			</div>
		</footer>
	);
}
