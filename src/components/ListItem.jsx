//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken }) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(false);

	// EVENT HANDLER
	const handleCheck = async (e) => {
		setIsChecked(!isChecked);
		await updateItem(listToken, e.target.name);
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
