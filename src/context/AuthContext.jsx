import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";

export const UserContext = createContext({ user: null, loading: true });

function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Spinner className='h-16 w-16 text-gray-900/50' />
		</div>
	);
}

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get("/user", {
					withCredentials: true,
				});
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};

		if (!user) {
			fetchUser();
		}
	}, [user]);

	return (
		<UserContext.Provider value={{ user, loading, setUser }}>
			{loading ? <LoadingSpinner /> : children}
		</UserContext.Provider>
	);
}
