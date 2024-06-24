export default function Footer() {
	return (
		<footer data-testid="footer">
			<div style={{ paddingTop: 32, textAlign: "center" }}>&copy; {new Date().getFullYear()} Marko Milicevic - Tous droits réservés</div>
		</footer>
	);
}
