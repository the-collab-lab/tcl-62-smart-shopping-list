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

	// HELPER FUNCTIONS
	const getDaysSinceLastTransaction = (dateLastPurchased, dateCreated) => {
		const oneDay = 24 * 60 * 60; // hours * minutes * seconds
		const lastTransactionDate = dateLastPurchased
			? dateLastPurchased.seconds
			: dateCreated.seconds; // Use the last purchased date if available, else use the created date

		const daysSinceLastTransaction = Math.round(
			Math.abs((now - lastTransactionDate) / oneDay),
		);

		return daysSinceLastTransaction;
	};

	// Helper fxn to calculate days between last and next purchased date
	const getDaysBetweenLastAndNextPurchase = (
		dateLastPurchased,
		dateCreated,
	) => {
		const dateLastPurchasedSeconds = dateLastPurchased
			? dateLastPurchased.seconds
			: dateCreated.seconds;
		const dateNextPurchasedSeconds = dateNextPurchased.seconds;

		const daysBetweenLastAndNextPurchased = Math.round(
			(dateNextPurchasedSeconds - dateLastPurchasedSeconds) / (60 * 60 * 24),
		);

		return daysBetweenLastAndNextPurchased;
	};

	const getNewNextPurchaseDate = (estimatedDays) => {
		const estimatedDaysInMilliseconds = estimatedDays * 1000 * 60 * 60 * 24;
		const newDateMilliseconds = estimatedDaysInMilliseconds + Date.now();
		return new Date(newDateMilliseconds);
	};

	// EVENT HANDLER
	const handleCheck = () => {
		if (!isChecked) {
			const daysSinceLastTransaction = getDaysSinceLastTransaction(
				dateLastPurchased,
				dateCreated,
			);
			const previousEstimate = getDaysBetweenLastAndNextPurchase(
				dateLastPurchased,
				dateCreated,
			);
			const estimatedDays = calculateEstimate(
				previousEstimate,
				daysSinceLastTransaction,
				totalPurchases,
			);
			const newNextPurchaseDate = getNewNextPurchaseDate(estimatedDays);

			updateItem(listToken, itemId, newNextPurchaseDate);
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
