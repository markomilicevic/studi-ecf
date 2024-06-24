import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

const retrieveCinemas = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas`);
	return response.data;
};

const retrieveClosestCinema = async () => {
	const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/v1/cinemas/closest`);
	return response.data;
};

export const CurrentCinemaContext = createContext();

export const CurrentCinemaProvider = ({ children }) => {
	const [countryCode, setCountryCode] = useState();
	const [cinema, setCinema] = useState();
	const [prefilledClosestCinema, setPrefilledClosestCinema] = useState(false);

	const { data, error, isLoading } = useQuery("cinemas", retrieveCinemas);

	const { data: closestData } = useQuery("cinema", retrieveClosestCinema);

	// Prefill the cinema
	useEffect(() => {
		if (!prefilledClosestCinema && !countryCode && closestData?.status === "COUNTRY_SUGGESTED") {
			// No country code selected and closest cinema received

			setCountryCode(closestData?.data?.countryCode);
			setPrefilledClosestCinema(true);
		}
	}, [prefilledClosestCinema, countryCode, closestData]);

	if (isLoading) {
		return;
	}

	return (
		<CurrentCinemaContext.Provider
			value={{
				data,
				error,
				isLoading,
				countryCode,
				setCountryCode,
				cinema,
				setCinema,
			}}
		>
			{children}
		</CurrentCinemaContext.Provider>
	);
};
