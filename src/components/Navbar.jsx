import { useEffect, useState } from "react";
import { Navbar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import LOGO from "../assets/logo2_nb.png";

export default function NavbarSearch() {
	const [balance, setBalance] = useState(null);

	useEffect(() => {
		const userId = Cookies.get("user_id");

		const userDocRef = doc(db, "users", userId);

		getDoc(userDocRef)
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const userData = docSnapshot.data();
					setBalance(userData.balance || 0);
				} else {
					console.log("User not found.");
				}
			})
			.catch((error) => {
				console.error("Error fetching balance:", error);
			});
	}, []);

	return (
		<Navbar className='mx-auto max-w-screen-xl px-4 py-3 mt-3 mb-2'>
			<div className='flex flex-wrap items-center justify-between gap-y-4 text-blue-gray-900'>
				<Link to={"/"}>
					<Typography
						as='a'
						href='/'
						variant='h5'
						className='mr-4 ml-2 cursor-pointer py-1.5'>
						<img src={LOGO} width={"120px"} />
					</Typography>
				</Link>
				<div className='ml-auto flex gap-1 md:mr-4'>
					<div className='mr-3 flex items-center gap-1 bg-blue-600 text-white p-2 rounded'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
							/>
						</svg>
						<Link className='mr-2 ' to={"https://t.me/logxstores"}>
							Join our Telegram
						</Link>
					</div>
					<Link className='mr-3 flex items-center gap-1' to={"/topup"}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3'
							/>
						</svg>
						Top Up
					</Link>
					<Link className='mr-3 flex items-center gap-1' to={"/profile"}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
							/>
						</svg>
						Profile
					</Link>
				</div>
				<div className='relative flex w-full gap-2 md:w-max'>
					<div className='bg-gray-800 p-2 rounded overflow-x-auto text-white'>
						<Typography variant='h6'>
							Balance: {balance !== null ? balance : "Loading..."}
						</Typography>
					</div>
				</div>
			</div>
		</Navbar>
	);
}
