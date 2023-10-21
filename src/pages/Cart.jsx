// TopUpPage.js
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";

const TopUpPage = () => {
	const [transactionId, setTransactionId] = useState("");
	const [amountPaid, setAmountPaid] = useState("");
	const [isWaitingForReview, setIsWaitingForReview] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const uid = Cookies.get("user_id");

	const handleTopUp = async () => {
		// Validation
		if (!transactionId.trim() || !amountPaid.trim()) {
			alert("Transaction ID and Amount cannot be empty");
			return;
		}

		const minAmount = 10;
		if (parseFloat(amountPaid) < minAmount) {
			alert(`Minimum amount for top-up is $${minAmount}`);
			return;
		}

		// Disable the button during submission
		setIsSubmitting(true);

		const transactionsRef = collection(db, "transactions");

		try {
			const newTransactionRef = await addDoc(transactionsRef, {
				uid,
				tid: transactionId,
				amount: parseFloat(amountPaid),
				status: false,
				timestamp: serverTimestamp(),
			});
			console.log(newTransactionRef.id);
			setIsWaitingForReview(true);
		} catch (error) {
			console.error("Error adding transaction: ", error);
		} finally {
			// Enable the button after submission
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-night-blue-black text-vibrant-red'>
			<div className='p-7 bg-black w-99 rounded-lg shadow-lg'>
				<h1 className='text-white text-2xl font-bold mb-4'>
					Top up your wallet
				</h1>
				<div className='mb-4'>
					<p className='text-gray-400'>Bitcoin Address:</p>
					<div className='bg-gray-800 p-2 rounded overflow-x-auto text-white'>
						1KeJNSKjQEXpyYSGDvTeLfCFFqkCp1iRtJ
					</div>
				</div>
				<p className='mb-4 text-gray-400'>Pay to this Bitcoin address</p>
				<p className='mb-4 text-gray-400'>
					Minimum amount: $10 (for wallet activation)
				</p>

				{/* Input Form for Transaction Details */}
				<div className='mb-4'>
					<label htmlFor='transactionId' className='text-gray-400 block mb-1'>
						Transaction ID:
					</label>
					<input
						type='text'
						id='transactionId'
						value={transactionId}
						onChange={(e) => setTransactionId(e.target.value)}
						className='bg-gray-800 p-2 w-full rounded text-white'
					/>
				</div>

				<div className='mb-4'>
					<label htmlFor='amountPaid' className='text-gray-400 block mb-1'>
						Amount Paid ($):
					</label>
					<input
						type='number'
						id='amountPaid'
						value={amountPaid}
						onChange={(e) => setAmountPaid(e.target.value)}
						className='bg-gray-800 p-2 w-full rounded text-white'
					/>
				</div>

				{/* Top Up Button */}
				<button
					onClick={handleTopUp}
					disabled={isSubmitting}
					className={` mb-2 bg-red-600 text-white px-4 py-2 rounded ${
						isSubmitting && "opacity-50 cursor-not-allowed"
					}`}>
					Top Up
				</button>

				{isWaitingForReview ? (
					<p className='mt-4 text-gray-400'>
						Wait for your Transaction to be reviewed. After Review, Balance wil
						be added
					</p>
				) : (
					<p className='mb-4 text-gray-400'>
						Please enter correct amount and transaction ID while Topup. Our
						Admins will update your wallet as soon as possible
					</p>
				)}
			</div>
		</div>
	);
};

export default TopUpPage;
