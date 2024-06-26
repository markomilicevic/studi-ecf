import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";

export default function Pagination({ pagination, onChange }) {
	const [page, setPage] = useState(pagination.currentPage - 1);
	const [rowsPerPage, setRowsPerPage] = useState(pagination.perPage);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		onChange(newPage + 1);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
		handleChangePage();
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
