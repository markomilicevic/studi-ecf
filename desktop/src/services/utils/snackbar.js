import { useSnackbar } from "notistack";

/**
 * This helper is made in order to trigger notification OUTSIDE React components
 */

let useSnackbarRef;
export const SnackbarUtilsConfigurator = () => {
	useSnackbarRef = useSnackbar();
	return null;
};

const val = {
	success(msg) {
		this.toast(msg, "success");
	},
	warning(msg) {
		this.toast(msg, "warning");
	},
	info(msg) {
		this.toast(msg, "info");
	},
	error(msg) {
		this.toast(msg, "error");
	},
	toast(msg, variant = "default") {
		useSnackbarRef.enqueueSnackbar(msg, { variant, autoHideDuration: 1500 });
	},
};

export default val;
