// LIBRARY IMPORTS
import React, { useState } from 'react';
import {
	Button,
	Box,
	Checkbox,
	Grid,
	GridItem,
	Text,
	Flex,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

// LOCAL IMPORTS
import { getDaysBetweenDates } from '../utils/dates.js';
import { updateItem, deleteItem } from '../api/firebase.js';

export function ListItem({
	name,
	listToken,
	dateLastPurchased,
	itemId,
	dateNextPurchased,
	dateCreated,
	totalPurchases,
}) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(
		Date.now() / 1000 - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

	//set a variable to store urgency indicator string
	//use conditional logic to set string
	//if today's date - last purchase date > 60
	//else if date next purchased - today's date > 0 && < 7
	//"soon"
	//if date next purchased - today's date >=7 && < 30
	//"kind of soon"
	//if date next purchased - today's date >= 30
	//"not soon"

	function getUrgency(dateLastPurchased = undefined, dateNextPurchased) {
		const today = new Date();

		const daysToNextPurchase = Math.round(
			getDaysBetweenDates(today, dateNextPurchased.toDate()),
		);

		if (
			dateLastPurchased &&
			getDaysBetweenDates(dateLastPurchased?.toDate(), today) > 60
		) {
			return 'Inactive';
		} else if (daysToNextPurchase > 0 && daysToNextPurchase < 7) {
			return 'Soon';
		} else if (daysToNextPurchase >= 7 && daysToNextPurchase < 30) {
			return 'Kind of soon';
		} else {
			return 'Not soon';
		}
	}

	const urgency = getUrgency(dateLastPurchased, dateNextPurchased);

	const getUrgencyColor = (urgency) => {
		switch (urgency) {
			case 'Inactive':
				return 'brand.off_white';
			case 'Soon':
				return 'brand.cherry_red';
			case 'Kind of soon':
				return 'brand.orange';
			default:
				return 'brand.yellow';
		}
	};

	// EVENT HANDLER
	const handleCheck = () => {
		if (!isChecked) {
			updateItem(
				listToken,
				itemId,
				dateLastPurchased,
				dateCreated,
				dateNextPurchased,
				totalPurchases,
			);
		}
		setIsChecked((prevState) => !prevState);
	};

	const handleDelete = () => {
		const confirmationChoice = window.confirm(
			'Are you sure you want to permanently delete this item?',
		);
		if (confirmationChoice) {
			deleteItem(listToken, itemId);
		}
	};

	return (
		<Grid
			templateColumns="repeat(4, 1fr)"
			templateRows="repeat(2, 1fr)"
			gap={10}
			border="1px solid #ccc"
			display="flex"
			alignItems="center"
			justifyContent="flex-start"
			padding="0.2rem 0.5rem"
		>
			<GridItem display="flex">
				<Checkbox
					colorScheme="green"
					bg="white"
					borderColor="brand.navy"
					size="lg"
					id={name}
					name={name}
					checked={isChecked}
					onChange={handleCheck}
				></Checkbox>
			</GridItem>
			<GridItem>
				<Text htmlFor={name}> {name} </Text>
			</GridItem>
			<GridItem>
				<Box
					bg={getUrgencyColor(urgency)}
					width="fit-content"
					height="fit-content"
					padding="0.2rem 0.5rem"
					borderRadius="8px"
				>
					{urgency}
				</Box>
			</GridItem>
			<GridItem display="flex">
				<Button
					leftIcon={<DeleteIcon />}
					bg="brand.navy"
					color="brand.off_white"
					onClick={handleDelete}
				>
					Delete
				</Button>
			</GridItem>
		</Grid>
	);
}
