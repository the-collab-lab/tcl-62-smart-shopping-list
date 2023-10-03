// LIBRARY IMPORTS
import React, { useState } from 'react';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
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
	const [days, setDays] = useState(7);
	const [status, setStatus] = useState(null);

	// function to clear the message after being displayed
	const clearMessageAfterDisplay = (setMessageFunction, delayMs = 1000) => {
		setTimeout(() => {
			setMessageFunction('');
		}, delayMs);
	};

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
		if (!itemName || trimmedItem === '') {
			setStatus(
				`You've submitted an empty field. Please enter a valid item name to add to list`,
			);
			clearMessageAfterDisplay(setStatus);
			setItemName('');
			return;
		}
		if (checkForDuplicates) {
			setStatus(`You have already added this item`);
			clearMessageAfterDisplay(setStatus);
			setItemName('');
			return;
		}

		let itemData = {
			itemName: itemName,
			daysUntilNextPurchase: days,
		};
		try {
			await addItem(listToken, itemData);
			setStatus('This item has been added to your list!');
			clearMessageAfterDisplay(setStatus);
			setItemName('');
			setDays(7);
		} catch (error) {
			setStatus("Oh no, this item wasn't added");
			clearMessageAfterDisplay(setStatus);
		}
	};

	return (
		<div>
			<Button onClick={onOpen}>Add Item</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add an item to your list</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="addItemForm" onSubmit={handleSubmit}>
							<FormControl>
								<FormLabel>Item name:</FormLabel>
								<Input
									type="text"
									id="itemName"
									onChange={handleItemNameChange}
									value={itemName}
								/>
								<br />
								<FormLabel>How soon will you buy this again?</FormLabel>
								<Select onChange={handleDaysChange} value={days}>
									<option value="7">Soon</option>
									<option value="14">Kind of Soon</option>
									<option value="30">Not Soon</option>
								</Select>
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button form="addItemForm" type="submit">
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{status && <p>{status}</p>}
		</div>
	);
}
