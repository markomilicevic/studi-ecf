export default function Footer() {
	return (
		<footer data-testid="footer">
			<div style={{ paddingTop: 14, textAlign: "center" }}>
				&copy; {new Date().getFullYear()} Marko Milicevic - Tous droits réservés -{" "}
				<a href="/tos" target="_blank" data-testid="footer-link-tos">
					<u>Conditions Générales d'Utilisation</u>
				</a>
				-{" "}
				<a href="https://github.com/markomilicevic/studi-ecf" target="_blank" rel="noreferrer">
					<u>Code source</u>
				</a>
			</div>
		</footer>
	);
}
