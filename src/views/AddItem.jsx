// LIBRARY IMPORTS
import React, { useState } from 'react';

//LOCAL IMPORTS
import { addItem } from '../api/firebase.js';

export function AddItem() {
	// SET STATES
	const [itemName, setItemName] = useState('');
	const [days, setDays] = useState(7);

	// HANDLE EVENTS
	const handleItemNameChange = (e) => {
		setItemName(e.target.value);
	};
	const handleDaysChange = (e) => {
		setDays(e.target.value);
		console.log(`day updated: ${days}`);
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		let itemData = {
			itemName: itemName,
			daysUntilNextPurchase: days,
		};

		addItem('1', itemData);
		// set object with itemName, daysUntilNextPurchase
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="itemName">
				Item name:
				<input type="text" id="itemName" onChange={handleItemNameChange} />
			</label>
			<br />
			<label>
				How soon will you buy this again?
				<select onChange={handleDaysChange}>
					<option value="7">Soon</option>
					<option value="14">Kind of Soon</option>
					<option value="30">Not Soon</option>
				</select>
			</label>
			<br />

			<button>Submit</button>
		</form>
	);
}
