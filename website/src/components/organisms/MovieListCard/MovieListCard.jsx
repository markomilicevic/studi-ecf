import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { MovieModal } from "components/organisms/MovieModal";

export default function MovieListCard({ data, error = false, isLoading = false }) {
	const [movieModalOpened, setMovieModalOpened] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState();

	if (isLoading) {
		return "...";
	}
	if (error) {
		return "Une erreur est survenue";
	}
	if (!data?.data?.length) {
		return "Pas de film";
	}

	return (
		<>
			<Grid container spacing={5} data-testid="movie-list-card">
				{data.data.map((movie) => (
					<Grid key={movie.movieId} item xs={12} md={6} lg={4} data-testid="movie-list-card-item">
						<Card style={{ position: "relative" }}>
							<a
								href="/movies"
								onClick={(event) => {
									event.preventDefault();
									setSelectedMovie(movie);
									setMovieModalOpened(true);
								}}
							>
								<CardMedia
									component="img"
									alt={movie.title}
									height="400"
									image={`${process.env.REACT_APP_STATIC_BASE_URL}/posters/${movie.posterId}.jpg`}
								/>
								{movie.isHightlight && (
									<div style={{ position: "absolute", top: 10, left: 10, fontSize: 20, color: "white", textShadow: "black 1px 0 10px" }}>
										⭐ coup de cœur
									</div>
								)}
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{movie.title}
									</Typography>
									<Typography variant="body2" color="text.primary">
										{movie.description.substring(0, 100)}...
									</Typography>
									<Grid container spacing={5}>
										<Grid item xs={6}>
											<Typography variant="body2" color="text.secondary">
												{movie.minimalAge ? (
													<span>
														Minimum <strong>{movie.minimalAge} ans</strong>
													</span>
												) : (
													<span>Tous public</span>
												)}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body2" color="text.secondary" style={{ textAlign: "right" }}>
												{movie.rating ? <strong>{movie.rating} / 5</strong> : <span>Pas encore noté</span>}
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</a>
						</Card>{" "}
					</Grid>
				))}
			</Grid>
			{movieModalOpened && selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					onClose={() => {
						setMovieModalOpened(false);
						setSelectedMovie(null);
					}}
				/>
			)}
		</>
	);
}
