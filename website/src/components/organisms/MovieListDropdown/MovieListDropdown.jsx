import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function MovieListDropdown({ data, error = false, isLoading = false, movie, setMovie }) {
	if (isLoading) {
		return "...";
	}
	if (error) {
		return "Une erreur est survenue";
	}
	if (!data?.length) {
		return "Pas de film";
	}

	return (
		<div data-testid="movie-list-dropdown" style={{ display: "flex", gap: 10, alignItems: "center" }}>
			<span>Votre film :</span>
			{!movie ? (
				<Box sx={{ width: 300 }}>
					<FormControl fullWidth>
						<InputLabel id="movie-list-select-movie-label">Selectionner le film</InputLabel>
						<Select
							labelId="movie-list-select-movie-label"
							id="movie-list-select-movie"
							data-testid="movie-list-dropdown-select-movie"
							label="Selectionner le film"
							value=""
							onChange={(event) => setMovie(data.find((movie) => movie.movieId === event.target.value))}
						>
							{data.map((movie) => (
								<MenuItem key={movie.movieId} value={movie.movieId}>
									{movie.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			) : (
				<div data-testid="movie-list-dropdown-selected-movie" style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
					<strong>{movie.title}</strong>
					<Button
						variant="contained"
						onClick={() => {
							setMovie(null);
						}}
						data-testid="movie-list-dropdown-change-movie"
					>
						Changer de film
					</Button>
				</div>
			)}
		</div>
	);
}
