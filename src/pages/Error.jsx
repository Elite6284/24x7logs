import { Button, Typography } from "@material-tailwind/react";

function Error() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Typography variant='h1' color='red'>
				Error 404
			</Typography>
			<Typography variant='lead'>Sorry, We Misplaced That Page</Typography>
			<Typography variant='paragraph'>Go back home</Typography>
			<Button>Home</Button>
		</div>
	);
}

export default Error;
