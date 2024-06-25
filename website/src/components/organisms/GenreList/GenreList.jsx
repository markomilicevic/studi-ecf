import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function GenreList({ data, error = false, isLoading = false, genre, setGenre }) {
	if (isLoading) {
		return "...";
	}
	if (error) {
		return "Une erreur est survenue";
	}
	if (!data?.length) {
		return "Pas de genre";
	}

	return (
		<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
			<span>Genre de film :</span>
			{!genre ? (
				<Box sx={{ minWidth: 250 }}>
					<FormControl fullWidth>
						<InputLabel id="genre-list-select-genre-label">Selectionner le cinéma</InputLabel>
						<Select
							labelId="genre-list-select-genre-label"
							id="genre-list-select-genre"
							data-testid="genre-list-select-genre"
							label="Selectionner le genre"
							value=""
							onChange={(event) => setGenre(data.find((genre) => genre.genreId === event.target.value))}
						>
							{data.map((genre) => (
								<MenuItem key={genre.genreId} value={genre.genreId}>
									{genre.genreName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			) : (
				<>
					<strong>{genre.genreName}</strong>
					<Button
						variant="contained"
						onClick={() => {
							setGenre(null);
						}}
					>
						Changer de genre
					</Button>
				</>
			)}
		</div>
	);
}
