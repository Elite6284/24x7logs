import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import { Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<>
			<div className='bg-blue-gray-900 flex-1 overflow-x-hidden overflow-y-auto'>
				<Routes>
					<Route
						path='/'
						element={
							<>
								<Navbar />
								<Home />
							</>
						}
					/>
					<Route
						path='/topup'
						element={
							<>
								<Navbar />
								<Cart />
							</>
						}
					/>

					<Route
						path='/profile'
						element={
							<>
								<Navbar />
								<Profile />
							</>
						}
					/>
					<Route path='/checkout/:productId' element={<Checkout />} />
					<Route path='/register' element={<Registration />} />
					<Route path='/login' element={<Login />} />
					<Route path='*' component={<Error />} />
				</Routes>
			</div>
		</>
	);
}
