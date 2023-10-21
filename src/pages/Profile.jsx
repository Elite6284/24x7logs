import { useEffect, useState } from "react";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Cookies from "js-cookie";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const userId = Cookies.get("user_id");

	// Fetch user details
	useEffect(() => {
		const userDocRef = doc(db, "users", userId);

		getDoc(userDocRef)
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const userData = docSnapshot.data();
					setUser(userData);
				} else {
					console.log("User not found.");
				}
			})
			.catch((error) => {
				console.error("Error fetching user details:", error);
			});
	}, [userId]);

	// Fetch past transactions
	useEffect(() => {
		const transactionsCollectionRef = collection(db, "transactions");
		const transactionsQuery = query(
			transactionsCollectionRef,
			where("uid", "==", userId)
		);

		getDocs(transactionsQuery)
			.then((querySnapshot) => {
				const transactionsData = [];
				querySnapshot.forEach((doc) => {
					transactionsData.push(doc.data());
				});
				setTransactions(transactionsData);
			})
			.catch((error) => {
				console.error("Error fetching transactions:", error);
			});
	}, [userId]);

	const handleLogout = () => {
		// Remove the "user_id" cookie
		Cookies.remove("user_id");
		// Redirect to the login page
		history.push("/login");
	};

	return (
		<div className='flex justify-center mt-4 text-white'>
			<div className='w-full max-w-screen-md p-4 bg-black rounded-lg shadow-md'>
				{user && (
					<div className='mb-4'>
						<h2 className='text-white text-2xl font-semibold mb-2'>
							User Details
						</h2>
						<div className='border p-3 rounded-lg text-gray-400'>
							<p className='text-lg font-semibold'>
								Name: <span className='font-thin'>{user.name}</span>
							</p>
							<p className='text-lg font-semibold'>
								Email: <span className='font-thin'>{user.email}</span>
							</p>
							<p className='text-lg font-semibold'>
								Balance: <span className='font-thin'>${user.balance}</span>
							</p>
						</div>
					</div>
				)}
				<button
					className='mt-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full'
					onClick={handleLogout}>
					Logout
				</button>
				<div>
					<h2 className='text-2xl font-semibold mb-2 text-white'>
						Past Transactions
					</h2>
					<table className='w-full border-collapse text-gray-400'>
						<thead>
							<tr>
								<th className='border p-2 text-lg font-semibold'>
									Transaction ID
								</th>
								<th className='border p-2 text-lg font-semibold'>Amount</th>
								<th className='border p-2 text-lg font-semibold'>Status</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction) => (
								<tr key={transaction.tid}>
									<td className='border p-2'>{transaction.tid}</td>
									<td className='border p-2'>${transaction.amount}</td>
									<td className='border p-2'>
										{transaction.status ? "Completed" : "Pending"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Profile;
