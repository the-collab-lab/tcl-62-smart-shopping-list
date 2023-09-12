//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken, dateLastPurchased, itemId }) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(
		Date.now() / 1000 - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

	// EVENT HANDLER
	const handleCheck = () => {
		if (!isChecked) {
			updateItem(listToken, itemId);
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
