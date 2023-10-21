import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function EcommerceCard({ name, price, desc, img, id }) {
	return (
		<>
			<Card className='w-75 bg-gray-900'>
				<CardHeader shadow={false} floated={false} className='h-96'>
					<img
						src={img}
						alt='card-image'
						className='h-full w-full object-cover'
					/>
				</CardHeader>
				<CardBody>
					<div className='mb-2 flex items-center justify-between'>
						<Typography color='white' className='font-medium'>
							{name}
						</Typography>
						<Typography color='white' className='font-medium'>
							${price}
						</Typography>
					</div>
					<Typography
						variant='small'
						color='white'
						className='font-normal opacity-75'>
						{desc}
					</Typography>
				</CardBody>
				<CardFooter className='pt-0'>
					<Link to={`/checkout/${id}`}>
						<Button
							ripple={false}
							fullWidth={true}
							variant='outlined'
							className='bg-blue-gray-100 text-black shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100'>
							Buy
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</>
	);
}
