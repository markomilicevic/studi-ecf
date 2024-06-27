import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import "moment/locale/fr";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Employee } from "components/pages/Employee";
import { HomePage } from "components/pages/HomePage";
import { CurrentUserProvider } from "components/templates/Page/providers/CurrentUserProvider";
import Snackbar, { SnackbarUtilsConfigurator } from "services/utils/snackbar.js";

import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

moment.locale("fr");

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			useErrorBoundary: true,
			retry: 3,
			retryDelay: 1000,
			staleTime: 30 * 1000, // In ms
			cacheTime: 30 * 1000, // In ms
		},
	},
});

const redirectLogged = () => {
	if (window.localStorage.getItem("FLAG_IS_CONNECTED-v1") === JSON.stringify(true)) {
		// Employee already logged
		// Do redirect to the employee's page
		window.location.href = "/desktop/employee";
	}
	return {};
};

const router = createBrowserRouter(
	[
		{
			path: "/",
			loader: redirectLogged,
			element: <HomePage />,
		},
		{
			path: "/employee",
			element: <Employee />,
		},
	],
	{
		basename: "/desktop",
	}
);

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	(response) => response, // When is 2xx
	(error) => {
		// When is NOT 2xx
		if (error.response?.status >= 500 && error.response?.status < 600) {
			Snackbar.error("Une erreur interne est survenue, merci de réessayer");
		}
		return Promise.reject(error);
	}
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SnackbarProvider>
			<SnackbarUtilsConfigurator />
			<QueryClientProvider client={queryClient}>
				<CurrentUserProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<RouterProvider router={router} />
					</ThemeProvider>
				</CurrentUserProvider>
			</QueryClientProvider>
		</SnackbarProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
