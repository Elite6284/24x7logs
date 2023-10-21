import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Pagination({
	productsPerPage,
	totalProducts,
	currentPage,
	paginate,
}) {
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
		pageNumbers.push(i);
	}

	const getItemProps = (index) => ({
		variant: currentPage === index ? "filled" : "text",
		color: "gray",
		onClick: () => paginate(index),
		className: "rounded-full",
	});

	const next = () => {
		if (currentPage === Math.ceil(totalProducts / productsPerPage)) return;

		paginate(currentPage + 1);
	};

	const prev = () => {
		if (currentPage === 1) return;

		paginate(currentPage - 1);
	};

	return (
		<div className='flex items-center gap-4'>
			<Button
				variant='text'
				className='flex items-center gap-2 rounded-full'
				onClick={prev}
				disabled={currentPage === 1}>
				<ArrowLeftIcon strokeWidth={2} className='h-4 w-4' /> Previous
			</Button>
			<div className='flex items-center gap-2'>
				{pageNumbers.map((number) => (
					<IconButton key={number} {...getItemProps(number)}>
						{number}
					</IconButton>
				))}
			</div>
			<Button
				variant='text'
				className='flex items-center gap-2 rounded-full'
				onClick={next}
				disabled={currentPage === Math.ceil(totalProducts / productsPerPage)}>
				Next
				<ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
			</Button>
		</div>
	);
}
