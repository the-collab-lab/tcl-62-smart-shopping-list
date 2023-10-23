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
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

//LOCAL IMPORTS
import { addItem } from '../api/firebase.js';

export function AddItem({
	listToken,
	data,
	isOpen,
	onOpen,
	onClose,
	hideButton = false,
}) {
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
			{!hideButton && (
				<Button
					leftIcon={<AddIcon />}
					bg="brand.off_white"
					color="brand.navy"
					onClick={() => {
						setIsAdded(false);
						setIsNotAdded(false);
						setIsAlreadyAdded(false);
						onOpen();
					}}
				>
					Add Item
				</Button>
			)}

			{/* Alert that displays when item is added */}
			{isAdded && (
				<Alert status="success">
					<AlertIcon />
					Item successfully added to your list!
				</Alert>
			)}

			{/* Alert that displays when item not added because missing field/s */}
			{isNotAdded && (
				<Alert status="error">
					<AlertIcon />
					Item was NOT added because one of more fields were incomplete. Please
					fill out all fields.
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
				<ModalContent bg="brand.off_white" color="brand.navy">
					<ModalHeader>Add an item to your list</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="addItemForm" onSubmit={handleSubmit}>
							<FormControl>
								<FormLabel fontWeight="bold">Item name:</FormLabel>
								<Input
									type="text"
									id="itemName"
									onChange={handleItemNameChange}
									value={itemName}
									borderColor="brand.navy"
								/>
							</FormControl>
							<br />
							<FormControl>
								<FormLabel fontWeight="bold">
									How soon will you buy this again?
								</FormLabel>
								<Select
									placeholder="Choose one"
									onChange={handleDaysChange}
									value={days}
									borderColor="brand.navy"
								>
									<option value="7">Soon</option>
									<option value="14">Kind of Soon</option>
									<option value="30">Not Soon</option>
								</Select>
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button
							leftIcon={<AddIcon />}
							form="addItemForm"
							type="submit"
							onClick={onClose}
							bg="brand.navy"
							color="brand.off_white"
							_hover={{ bg: 'grey' }}
						>
							Add Item
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
