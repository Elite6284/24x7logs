import { useState } from "react";
import {
	Card,
	Input,
	Checkbox,
	Button,
	Typography,
	Spinner,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import logoImage from "../assets/logo_nb.png"; // Import your logo image

export default function Registration() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const notifyError = (content) => toast.error(content);
	const notifySuccess = (content) => toast.success(content);

	const checkIfEmailExists = async (email) => {
		const usersRef = collection(db, "users");
		const q = query(usersRef, where("email", "==", email));
		const querySnapshot = await getDocs(q);

		return !querySnapshot.empty;
	};

	const registerUser = async (e) => {
		e.preventDefault();
		if (!email && !password && !name) {
			notifyError("Please enter the credentials properly");
			return;
		}
		if (password.length < 6) {
			notifyError("Password too short");
			return;
		}

		try {
			setLoading(true);
			const emailExists = await checkIfEmailExists(email);
			if (emailExists) {
				notifyError("User with this email already exists");
				return;
			}
			let balance = 0;
			const docRef = await addDoc(collection(db, "users"), {
				name,
				email,
				password,
				balance,
			});
			console.log("Document written with ID: ", docRef.id);

			setName("");
			setEmail("");
			setPassword("");
			notifySuccess("Registered Successfully!");
			navigate("/login");
		} catch (err) {
			setName("");
			setEmail("");
			setPassword("");
			notifyError("Something went wrong!");
			console.log(err);
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
					Sign Up
				</Typography>
				<Typography className='text-gray-100 mt-1 font-normal'>
					Enter your details to register.
				</Typography>
				<form
					className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96'
					onSubmit={registerUser}>
					<div className='mb-4 flex flex-col gap-6'>
						<Input
							size='lg'
							label='Name'
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>
						<Input
							size='lg'
							label='Email'
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						<Input
							type='password'
							size='lg'
							label='Password'
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>
					<Checkbox
						label={
							<Typography
								variant='small'
								color='gray'
								className='flex items-center font-normal'>
								I agree the
								<a
									href='#'
									className='font-medium transition-colors hover:text-gray-900'>
									&nbsp;Terms and Conditions
								</a>
							</Typography>
						}
						containerProps={{ className: "-ml-2.5" }}
					/>
					<Button
						type='submit'
						className='flex items-center justify-center mt-6'
						fullWidth>
						{loading ? <Spinner className='h-4 w-4' /> : "Register"}
					</Button>
					<Typography color='gray' className='mt-4 text-center font-normal'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-gray-100'>
							Sign In
						</Link>
					</Typography>
				</form>
				<Toaster duration={2000} />
			</Card>
		</div>
	);
}
