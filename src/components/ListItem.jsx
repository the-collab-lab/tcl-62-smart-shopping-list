//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

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
		</li>
	);
}
