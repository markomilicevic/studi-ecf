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

import { Account } from "components/pages/Account";
import { AccountReset } from "components/pages/AccountReset";
import { Admin } from "components/pages/Admin";
import { AdminAnalytics } from "components/pages/AdminAnalytics";
import { Booking } from "components/pages/Booking";
import { Contact } from "components/pages/Contact";
import { HomePage } from "components/pages/HomePage";
import { Intranet } from "components/pages/Intranet";
import { Movies } from "components/pages/Movies";
import { User } from "components/pages/User";
import { BannerProvider } from "components/templates/Page/providers/BannerProvider";
import { CurrentCinemaProvider } from "components/templates/Page/providers/CurrentCinemaProvider";
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
		// User already logged
		// Do redirect to the home
		window.location.href = "/";
	}
	return {};
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/booking",
		element: <Booking />,
	},
	{
		path: "/movies",
		element: <Movies />,
	},
	{
		path: "/contact",
		element: <Contact />,
	},
	{
		path: "/account",
		loader: redirectLogged,
		element: <Account />,
	},
	{
		path: "/account/reset/:resetPasswordToken",
		loader: redirectLogged,
		element: <AccountReset />,
	},
	{
		path: "/admin",
		element: <Admin />,
	},
	{
		path: "/admin/analytics",
		element: <AdminAnalytics />,
	},
	{
		path: "/intranet",
		element: <Intranet />,
	},
	{
		path: "/user",
		element: <User />,
	},
]);

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
				<BannerProvider>
					<CurrentUserProvider>
						<CurrentCinemaProvider>
							<ThemeProvider theme={theme}>
								<CssBaseline />
								<RouterProvider router={router} />
							</ThemeProvider>
						</CurrentCinemaProvider>
					</CurrentUserProvider>
				</BannerProvider>
			</QueryClientProvider>
		</SnackbarProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
