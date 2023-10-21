import { useState, useEffect } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import Cookies from "js-cookie";
import { db, storage } from "../firebase"; // Import your LoadingSpinner component

export function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Spinner className='h-16 w-16 text-red-500' />
		</div>
	);
}

const Checkout = () => {
	const { productId } = useParams();

	const [product, setProduct] = useState(null);
	const [downloading, setDownloading] = useState(false);
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

	useEffect(() => {
		console.log(productId);
		const fetchData = async () => {
			try {
				const productDocRef = doc(db, "files", productId);
				const productData = await getDoc(productDocRef);
				if (productData.exists()) {
					setProduct(productData.data());
				} else {
					alert("Product not found.");
				}
			} catch (error) {
				console.error("Error fetching product:", error);
				alert("Error fetching product. Please try again.");
			}
		};

		fetchData();
	}, [productId]);

	const handleConfirmBuy = async () => {
		if (!product) {
			console.log("Product not found");
			alert("Product not found.");
			return;
		}

		if (balance < product.price) {
			console.log("Insufficient balance");
			alert("Insufficient balance. Please top up your balance.");
			return;
		}

		setDownloading(true);

		try {
	
			const fileRef = storageRef(storage, product.filePath);
			const url = await getDownloadURL(fileRef);
			const response = await fetch(url);
			const data = await response.blob();
			// Deduct the product price from the user's balance
			const newBalance = balance - product.price;

			// Update user balance in Firestore
			const userId = Cookies.get("user_id");
			const userDocRef = doc(db, "users", userId);
			await updateDoc(userDocRef, {
				balance: newBalance,
			});

			const a = document.createElement("a");
			a.href = window.URL.createObjectURL(data);
			a.download = product.name;
			a.style.display = "none";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(a.href);

			window.location.href = "/";

			const productDocRef = doc(db, "files", productId);
			await deleteDoc(productDocRef);

			const statsDocRef = doc(db, "stats", "72sv0mvdAH8OeGZqejYy");
			const statsDoc = await getDoc(statsDocRef);
			if (statsDoc.exists()) {
				const currentRevenue = statsDoc.data().revenue || 0;
				const newRevenue = currentRevenue + product.price;
				const newSales = statsDoc.data().sales + 1;

				await updateDoc(statsDocRef, {
					revenue: newRevenue,
					sales: newSales,
				});
			}
		} catch (error) {
			console.error("Error during checkout:", error);
			alert("Error during checkout. Please try again.");
		}
	};

	if (!product) {
		return <LoadingSpinner />;
	}

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='w-[400px] p-6 bg-black text-white shadow-lg rounded-lg'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-2xl font-bold text-red-500'>Checkout</h2>
					<div className='p-2 bg-gray-700 rounded-md'>
						<p className='text-white'>Balance: ${balance}</p>
					</div>
				</div>
				<div className='grid grid-cols-1 gap-4'>
					<div className='flex items-center justify-between'>
						<span className='font-medium'>{product.name}</span>
						<span className='text-red-500'>${product.price}</span>
					</div>
					<p className='font-normal opacity-75'>{product.desc}</p>
					{balance >= product.price ? (
						<Button
							fullWidth={true}
							variant='gradient'
							onClick={handleConfirmBuy}
							disabled={downloading}
							className='bg-red-500 hover:bg-red-700'>
							{downloading ? "Downloading..." : "Confirm Buy"}
						</Button>
					) : (
						<div className='bg-red-500 p-2 rounded-md'>
							<p className='text-white'>
								Insufficient balance. Top up your balance.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Checkout;
