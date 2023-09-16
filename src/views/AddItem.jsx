// LIBRARY IMPORTS
import React, { useState } from 'react';

//LOCAL IMPORTS
import { addItem } from '../api/firebase.js';

export function AddItem({ listToken, data }) {
	// SET STATES
	const [itemName, setItemName] = useState('');
	const [days, setDays] = useState(7);
	const [status, setStatus] = useState(null);
	// NON RegEx VERSION FOR CLEANING INPUT
	// const cleanedUpItems = (userInput) =>{
	// 	const alphabet = 'abcdefghijklmnopqrstuvwxyz'
	// 	const acceptedCharacters = alphabet+alphabet.toUpperCase()+'0123456789'
	// 	let acceptableString = ''
	// 	for (let i=0; i<userInput.length; i++){
	// 		const goodChar = userInput[i]
	// 		if(acceptedCharacters.includes(goodChar)){
	// 			acceptableString += goodChar
	// 		}
	// 	}
	// 	return acceptableString.toLowerCase()
	// }

	// const trimmedItem = cleanedUpItems(itemName)
	// const names = data.map((item) => cleanedUpItems(item.name))

	// function to clear the message after being displayed
	const clearMessageAfterDisplay = (setMessageFunction, delayMs = 1000) => {
		setTimeout(() => {
			setMessageFunction('');
		}, delayMs);
	};

	// RegEX VERSION, SAME RESULT AS ABOVE
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
			<form onSubmit={handleSubmit}>
				<label htmlFor="itemName">
					Item name:
					<input
						type="text"
						id="itemName"
						onChange={handleItemNameChange}
						value={itemName}
					/>
				</label>
				<br />
				<label>
					How soon will you buy this again?
					<select onChange={handleDaysChange} value={days}>
						<option value="7">Soon</option>
						<option value="14">Kind of Soon</option>
						<option value="30">Not Soon</option>
					</select>
				</label>
				<br />

				<button>Submit</button>
			</form>
			{status && <p>{status}</p>}
		</div>
	);
}
