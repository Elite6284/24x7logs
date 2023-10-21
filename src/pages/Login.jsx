import { useState } from "react";
import {
	Card,
	Input,
	Button,
	Typography,
	Spinner,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Cookies from "js-cookie";
import logoImage from "../assets/logo_nb.png"; // Import your logo image

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const notifyError = (content) => toast.error(content);
	const notifySuccess = (content) => toast.success(content);

	const loginUser = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			notifyError("Please enter the credentials properly");
			return;
		}

		try {
			setLoading(true);

			// Query Firestore for the user with the provided email and password
			const usersRef = collection(db, "users");
			const q = query(
				usersRef,
				where("email", "==", email),
				where("password", "==", password)
			);
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				notifyError("Invalid email or password");
				return;
			}
			const userDoc = querySnapshot.docs[0];

			Cookies.set("user_id", userDoc.id, {
				expires: 7,
				secure: true,
			});

			navigate("/");
			notifySuccess("Logged In Successfully!");
		} catch (err) {
			notifyError("Something went wrong!");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<img src={logoImage} alt='Trusted Logs' className='w-50 h-24' />
			<Typography variant='paragraph' color='white' className='mt-1'>
				Trusted Logs 24x7
			</Typography>
			<Card className='p-5 bg-black mt-6' shadow={false}>
				<Typography variant='h4' color='white'>
					Login
				</Typography>
				<Typography className='mt-1 font-normal text-gray-100'>
					Enter your Login credentials.
				</Typography>
				<form
					onSubmit={loginUser}
					className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96'>
					<div className='mb-4 flex flex-col gap-6'>
						<Input
							size='lg'
							label='Email'
							color='white'
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type='password'
							size='lg'
							color='white'
							onChange={(e) => setPassword(e.target.value)}
							label='Password'
						/>
					</div>
					<Button
						type='submit'
						className='flex items-center justify-center mt-6'
						fullWidth>
						{loading ? <Spinner className='h-4 w-4' /> : "Login"}
					</Button>
					<Typography color='gray' className='mt-4 text-center font-normal'>
						Don&apos;t have an account?{" "}
						<Link to='/register' className='font-medium text-blue-gray-100'>
							Register
						</Link>
					</Typography>
				</form>
				<Toaster duration={2000} />
			</Card>
		</div>
	);
}

export default Login;
