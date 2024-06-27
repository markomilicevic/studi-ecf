import { Page } from "components/templates/Page";

export default function Tos() {
	return (
		<Page data-testid="tos">
			<h2>Conditions Générales d'Utilisation</h2>

			<h3 style={{ padding: "32px 0 8px 0" }}>Contexte</h3>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> est un site factice conçu dans le cadre d'un exercice, toutes les informations présentes dans ce site
				ne sont pas contractuelles.
			</p>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> se remet à zéro toutes les nuits à minuit (UTC), toutes les données sont alors détruites et perdu à
				jamais.
			</p>

			<h3 id="cookies" style={{ padding: "40px 0 8px 0" }}>
				Cookies
			</h3>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> utilise uniquement des cookies techniques permettant de maintenir la session de l'utilisateur et de
				permettre l'accès aux espaces connectés. Aucune donnée nominative n'est stockée dans ces cookies et en aucun cas ces cookies ne sont communiqués
				à des tiers.
			</p>

			<h3 id="contact" style={{ padding: "40px 0 8px 0" }}>
				Contact
			</h3>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> est hébérgé par : Scaleway SAS - BP 438 - 75366 Paris CEDEX 08 - RCS Paris B 433 115 904 - France
			</p>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> est géré par un particulier résidant en France : Monsieur MILICEVIC Marko -{" "}
				<u>marko@markomilicevic.fr</u>
			</p>

			<h3 style={{ padding: "40px 0 8px 0" }}>Juridiction</h3>
			<p>
				Le site <u>studi-ecf.markomilicevic.fr</u> est sous la juridication du tribunal de Paris, France
			</p>
		</Page>
	);
}
