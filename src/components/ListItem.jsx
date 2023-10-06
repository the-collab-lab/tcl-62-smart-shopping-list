// LIBRARY IMPORTS
import React, { useState } from 'react';
import {
	Button,
	Box,
	Checkbox,
	Flex,
	Spacer,
	StackDivider,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

// LOCAL IMPORTS
import './ListItem.css';
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
				return 'urgency-inactive-color';
			case 'Soon':
				return 'urgency-soon-color';
			case 'Kind of soon':
				return 'urgency-kind-of-soon-color';
			default:
				return 'urgency-not-soon-color';
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
		<Flex direction="row">
			<li className="ListItem">
				<Checkbox
					colorScheme="green"
					bg="white"
					borderColor="brand.navy"
					size="lg"
					spacing={5}
					direction="row"
					id={name}
					name={name}
					checked={isChecked}
					onChange={handleCheck}
				></Checkbox>
				<Spacer />
				<label htmlFor={name}> {name} </label>
				<Box
					className="urgency-indicator"
					bg={`var(--${getUrgencyColor(urgency)})`}
				>
					{urgency}
				</Box>
				<Button
					leftIcon={<DeleteIcon />}
					bg="brand.navy"
					color="brand.off_white"
					onClick={handleDelete}
				>
					Delete
				</Button>
			</li>
		</Flex>
	);
}
