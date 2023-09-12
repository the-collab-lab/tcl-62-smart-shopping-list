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
	const now = Date.now() / 1000; //current time in seconds
	// SET STATES
	const [isChecked, setIsChecked] = useState(
		now - dateLastPurchased?.seconds < 60 * 60 * 24,
	);

	// Helper function to calculate days since last purchase
	const getDaysSinceLastPurchase = (dateLastPurchased, dateCreated) => {
		const oneDay = 24 * 60 * 60; // hours * minutes * seconds
		const lastPurchasedDate = dateLastPurchased
			? dateLastPurchased.seconds
			: dateCreated.seconds; // Use the last purchased date if available, else use the created date

		const daysSinceLastPurchase = Math.round(
			Math.abs((now - lastPurchasedDate) / oneDay),
		);

		return daysSinceLastPurchase;
	};

	// Helper fxn to calculate days between last and next purchased date
	const getDaysBetweenLastAndNextPurchase = (
		dateLastPurchased,
		dateCreated,
	) => {
		const dateLastPurchasedJS = dateLastPurchased?.toDate(); // Convert Firestore's Timestamp object to Javascript Date object
		const dateNextPurchasedJS = dateNextPurchased.toDate();
		const dateLastPurchasedSeconds = dateLastPurchasedJS?.getTime() / 1000;
		const dateNextPurchasedSeconds = dateNextPurchasedJS.getTime() / 1000;

		const daysBetweenLastAndNextPurchased = Math.round(
			Math.abs(dateNextPurchasedSeconds - dateLastPurchasedSeconds) /
				(60 * 60 * 24),
		);

		return daysBetweenLastAndNextPurchased;
	};

	// EVENT HANDLER
	const handleCheck = () => {
		if (!isChecked) {
			const daysSinceLastTransaction = getDaysSinceLastPurchase(
				dateLastPurchased,
				dateCreated,
			);

			const daysBetweenLastAndNextPurchase = getDaysBetweenLastAndNextPurchase(
				dateLastPurchased,
				dateCreated,
			);

			const previousEstimate =
				dateLastPurchased === null ? 14 : daysBetweenLastAndNextPurchase;

			console.log('days since last transaction:', daysSinceLastTransaction);
			console.log(
				'days between last and next purchased:',
				daysBetweenLastAndNextPurchase,
			);

			// let estimatedDays = calculateEstimate( previousEstimate, daysSinceLastTransaction, totalPurchases);

			// calculate date from estimated number of days and pass to updateItem
			updateItem(listToken, itemId); // NEED TO PASS DATENEXTPURCHASED AS DATE, CALCULATED USING CALCULATEESTIMATE
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
