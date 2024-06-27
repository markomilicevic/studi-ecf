import { createContext } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

const retrieveMe = async (isConnected) => {
	if (!isConnected) {
		return;
	}
	try {
		const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/me`);
		return response.data;
	} catch (err) {
		if (err?.response?.status === 401) {
			// Force signout
			window.localStorage.removeItem("FLAG_IS_CONNECTED-v1");
		}
		throw err;
	}
};

const deleteAuth = async () => {
	return await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/users/auth`);
};

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
	let isConnected = window.localStorage.getItem("FLAG_IS_CONNECTED-v1") === JSON.stringify(true);

	const { data, error, isLoading, refetch } = useQuery("me", () => retrieveMe(isConnected));

	const signoutMutation = useMutation({
		mutationFn: deleteAuth,
	});

	const flag = () => {
		if (isConnected) {
			return;
		}
		window.localStorage.setItem("FLAG_IS_CONNECTED-v1", JSON.stringify(true));
		isConnected = true;
		refetch();
	};

	const signout = (next) => {
		if (!isConnected) {
			return;
		}
		signoutMutation.mutate(
			{},
			{
				onError: (response) => {
					next(response);
				},
				onSuccess: () => {
					window.localStorage.removeItem("FLAG_IS_CONNECTED-v1");
					next(null, true);
				},
			}
		);
	};

	if (isLoading) {
		return;
	}

	return (
		<CurrentUserContext.Provider
			value={{
				isConnected,
				flag,
				signout,
				data,
				error,
				isLoading,
			}}
		>
			{children}
		</CurrentUserContext.Provider>
	);
};
