//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export function ListItem({
	name,
	listToken,
	dateLastPurchased,
	itemId,
	totalPurchases,
	dateCreated,
	dateNextPurchased,
}) {
	const currentDate = Date.now();
	// SET STATES
	const [isChecked, setIsChecked] = useState(
		Date.now() / 1000 - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

	// EVENT HANDLER
	const handleCheck = () => {
		if (!isChecked) {
			const daysBetweenLastAndNextPurchased = Math.round(
				(Math.abs(dateNextPurchased.seconds - dateLastPurchased?.seconds) /
					60) *
					60 *
					24,
			);
			console.log('date next:', dateNextPurchased);
			console.log('date last:', dateLastPurchased);
			console.log('between:', daysBetweenLastAndNextPurchased);
			const previousEstimate =
				dateLastPurchased === null ? 14 : daysBetweenLastAndNextPurchased;
			const daysSinceLastTransaction = null;
			// let estimatedDays = calculateEstimate( previousEstimate, daysSinceLastTransaction, totalPurchases);
			// calculate date from estimated number of days and pass to updateItem
			updateItem(listToken, itemId); // NEED TO PASS DATENEXTPURCHASED AS DATE, CALCULATED USING CALCULATEESTIMATE
		}
		setIsChecked((prevState) => !prevState);
	};

	// previousEstimate == Diff between dateNextPurchased and dateLastPurchased (if dateLast not null)

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
