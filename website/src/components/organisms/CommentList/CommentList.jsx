import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { Pagination } from "components/molecules/Pagination";

const retrieveComments = async ({ movieId, currentPage, perPage }) => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/movies/${encodeURIComponent(movieId)}/comments`, {
		params: {
			currentPage,
			perPage,
		},
	});
	return response.data;
};

export default function CommentList({ movieId }) {
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: commentsData,
		error: commentsError,
		isLoading: commentsIsLoading,
	} = useQuery(`user-orders-${movieId}-${currentPage}`, () => retrieveComments({ movieId, currentPage, perPage: 10 }));

	if (commentsIsLoading) {
		return <div>Loading comments</div>;
	}
	if (commentsError) {
		return <div>Failed to fetch comments</div>;
	}
	if (!commentsData?.data?.length) {
		// No comment for now for this movie
		return <div>Pas encore de commentaire</div>;
	}

	return (
		<div>
			<h1>Commentaires</h1>

			<table>
				<thead>
					<tr>
						<td>Auteur</td>
						<td>Commentaire</td>
					</tr>
				</thead>
				<tbody>
					{commentsData.data.map((comment) => (
						<tr key={comment.movieCommentId}>
							<td>{comment.userName}</td>
							<td>{comment.comment}</td>
						</tr>
					))}
				</tbody>
			</table>
			{commentsData.meta?.pagination && <Pagination pagination={commentsData.meta?.pagination} onChange={(pageNumber) => setCurrentPage(pageNumber)} />}
		</div>
	);
}
