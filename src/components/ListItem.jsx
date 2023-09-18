//LIBRARY IMPORTS
import React, { useState } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';
import { getDaysBetweenDates } from '../utils/dates.js';

export function ListItem({
	name,
	listToken,
	dateLastPurchased,
	itemId,
	dateNextPurchased,
}) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(
		Date.now() / 1000 - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

	//set a variable to store urgency indicator string
	//use conditional logic to set string
	//if today's date - last purchase date > 60
	//else if date next purchased - today's date > 0 && < 7
	//"soon"
	//if date next purchased - today's date >=7 && < 30
	//"kind of soon"
	//if date next purchased - today's date >= 30
	//"not soon"

	function getUrgency(dateLastPurchased = undefined, dateNextPurchased) {
		const today = new Date();

		const daysToNextPurchase = getDaysBetweenDates(
			today,
			dateNextPurchased.toDate(),
		);
		console.log('days between: ', daysToNextPurchase);
		if (
			dateLastPurchased &&
			getDaysBetweenDates(dateLastPurchased?.toDate(), today) > 60
		) {
			return 'Inactive';
		} else if (daysToNextPurchase > 0 && daysToNextPurchase < 7) {
			return 'Soon';
		} else if (daysToNextPurchase >= 7 && daysToNextPurchase < 30) {
			return 'Kind of soon';
		} else {
			return 'Not soon';
		}
	}

	const urgency = getUrgency(dateLastPurchased, dateNextPurchased);

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
			<div className="urgency-indicator">{urgency}</div>
		</li>
	);
}
