import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { Spinner, Input, Button } from "@material-tailwind/react";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import Cookies from "js-cookie";

export function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Spinner className='h-16 w-16 text-gray-900/50' />
		</div>
	);
}

function Home() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredProducts, setFilteredProducts] = useState([]);

	//auth useeffect
	useEffect(() => {
		const userId = Cookies.get("user_id");
		if (!userId) {
			window.location.href = "/login";
		} else {
			const userDocRef = doc(db, "users", userId);

			getDoc(userDocRef)
				.then((docSnapshot) => {
					if (docSnapshot.exists()) {
						const userData = docSnapshot.data();
						if (userData.balance === 0) {
							window.location.href = "/topup";
							alert("Add balance to activate your account");
						}
					} else {
						console.log("User not found.");
					}
				})
				.catch((error) => {
					console.error("Error fetching user details:", error);
				});
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const filesCollection = collection(db, "files");
				const filesSnapshot = await getDocs(filesCollection);
				const filesData = filesSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setProducts(filesData);
				setFilteredProducts(filesData);
				setLoading(false);
			} catch (error) {
				setError(true);
			}
		};

		fetchData();
	}, []);

	const handleSearchInputChange = (event) => {
		const { value } = event.target;
		setSearchQuery(value);

		const filtered = products.filter((product) =>
			product.name.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredProducts(filtered);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <div>Error loading data.</div>;
	}

	return (
		<div className='relative'>
			<div className='flex justify-center mt-4'>
				<div className='w-full max-w-screen-md p-4 bg-[#d2d6d9] rounded-lg shadow-md'>
					<div className='w-full flex gap-2'>
						<Input
							type='search'
							color='black'
							label='Search Banks...'
							className='pr-20'
							containerProps={{
								className: "w-full",
							}}
							value={searchQuery}
							onChange={handleSearchInputChange}
						/>
						<Button size='sm' color='black' className='rounded'>
							Search
						</Button>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4'>
				{filteredProducts.map((product, index) => (
					<ProductCard
						id={product.id}
						name={product.name}
						price={product.price}
						desc={product.desc}
						img={product.imageUrl}
						key={index}
					/>
				))}
			</div>
		</div>
	);
}

export default Home;
