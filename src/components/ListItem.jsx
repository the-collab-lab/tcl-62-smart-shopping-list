//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem, deleteItem } from '../api/firebase.js';

export function ListItem({
	name,
	listToken,
	dateLastPurchased,
	itemId,
	totalPurchases,
	dateCreated,
	dateNextPurchased,
}) {
	const now = Date.now() / 1000; //current time in seconds

	// SET STATES
	const [isChecked, setIsChecked] = useState(
		now - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

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
		<li className="ListItem">
			<input
				type="checkbox"
				id={name}
				name={name}
				checked={isChecked}
				onChange={handleCheck}
			/>
			<label htmlFor={name}> {name} </label>

			<button onClick={handleDelete}> Delete </button>
		</li>
	);
}
