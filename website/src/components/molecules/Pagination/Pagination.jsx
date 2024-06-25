import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";

export default function Pagination({ pagination, onChange }) {
	const [page, setPage] = useState(pagination.currentPage);
	const [rowsPerPage, setRowsPerPage] = useState(pagination.perPage);

	const handleChangePage = (event, newPage) => {
		onChange(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TablePagination
			component="div"
			count={pagination.itemCount}
			page={page}
			onPageChange={handleChangePage}
			rowsPerPage={rowsPerPage}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	);
}
