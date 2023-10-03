// LIBRARY IMPORTS
import React, { useState } from 'react';
import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Select,
	useDisclosure,
} from '@chakra-ui/react';

//LOCAL IMPORTS
import { addItem } from '../api/firebase.js';

export function AddItem({ listToken, data }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	// SET STATES
	const [itemName, setItemName] = useState('');
	const [days, setDays] = useState(0);
	const [isAdded, setIsAdded] = useState(false);
	const [isNotAdded, setIsNotAdded] = useState(false);
	const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

	const isEmptyName = itemName === '';
	const isEmptyDays = days === 0;

	const regexSpecialCharacters = /[^a-z0-9]/g;
	const cleanUpItem = (userInput) => {
		return userInput.toLowerCase().replace(regexSpecialCharacters, '');
	};
	const names = data.map((key) => cleanUpItem(key.name));
	const trimmedItem = cleanUpItem(itemName);
	const checkForDuplicates = names.includes(trimmedItem);

	// HANDLE EVENTS
	const handleItemNameChange = (e) => {
		setItemName(e.target.value);
	};
	const handleDaysChange = (e) => {
		setDays(e.target.value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Check for empty fields
		if (isEmptyName || isEmptyDays || trimmedItem === '') {
			setIsNotAdded(true);
			setItemName('');
			setDays(0);
			return;
		}

		if (checkForDuplicates) {
			setIsAlreadyAdded(true);
			setItemName('');
			setDays(0);
			return;
		}

		let itemData = {
			itemName: itemName,
			daysUntilNextPurchase: days,
		};

		try {
			await addItem(listToken, itemData);
			setIsAdded(true);
			setItemName('');
			setDays(0);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Button
				onClick={() => {
					setIsAdded(false);
					setIsNotAdded(false);
					setIsAlreadyAdded(false);
					onOpen();
				}}
			>
				Add Item
			</Button>
			{/* Alert that displays when item is added */}
			{isAdded && (
				<Alert status="success">
					<AlertIcon />
					Item added successfully! {data.itemName} has been added to your list.
				</Alert>
			)}

			{/* Alert that displays when item not added because missing field/s */}
			{isNotAdded && (
				<Alert status="error">
					<AlertIcon />
					Item was NOT added. Please fill out all fields.
				</Alert>
			)}

			{/* Alert that displays when item not added because duplicate */}
			{isAlreadyAdded && (
				<Alert status="warning">
					<AlertIcon />
					You've already added this item, so we were not able to add it to your
					list.
				</Alert>
			)}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add an item to your list</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="addItemForm" onSubmit={handleSubmit}>
							<FormControl isInvalid={isEmptyName}>
								<FormLabel>Item name:</FormLabel>
								<Input
									type="text"
									id="itemName"
									onChange={handleItemNameChange}
									value={itemName}
								/>
								{isEmptyName && (
									<FormErrorMessage>Item name is required.</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isInvalid={isEmptyDays}>
								<FormLabel>How soon will you buy this again?</FormLabel>
								<Select
									placeholder="Select when you'll purchase again"
									onChange={handleDaysChange}
									value={days}
								>
									<option value="7">Soon</option>
									<option value="14">Kind of Soon</option>
									<option value="30">Not Soon</option>
								</Select>
								{isEmptyDays && (
									<FormErrorMessage>A selection is required.</FormErrorMessage>
								)}
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button form="addItemForm" type="submit" onClick={onClose}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
