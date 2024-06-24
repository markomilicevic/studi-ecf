import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Account } from "components/pages/Account";
import { Booking } from "components/pages/Booking";
import { Contact } from "components/pages/Contact";
import { HomePage } from "components/pages/HomePage";
import { Movies } from "components/pages/Movies";

import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

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
		element: <Account />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
