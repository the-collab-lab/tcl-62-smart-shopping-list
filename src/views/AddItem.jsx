// LIBRARY IMPORTS
import React, { useState } from 'react';

//LOCAL IMPORTS
import { addItem } from '../api/firebase.js';

export function AddItem() {
	// SET STATES
	const [itemName, setItemName] = useState('');
	const [days, setDays] = useState(0);
	const [status, setStatus] = useState(null);

	// HANDLE EVENTS
	const handleItemNameChange = (e) => {
		setItemName(e.target.value);
	};
	const handleDaysChange = (e) => {
		setDays(e.target.value);
		console.log(`day updated: ${days}`);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		let itemData = {
			itemName: itemName,
			daysUntilNextPurchase: days,
		};

		try {
			await addItem('my test list', itemData);
			setStatus('This item has been added to your list!');
			setItemName('');
			setDays(0);
		} catch (error) {
			setStatus("Oh no, this item wasn't added");
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
						<option value="">Please choose an option</option>
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
