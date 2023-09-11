//LIBRARY IMPORTS
import React, { useState, useEffect, useRef } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken, dateLastPurchased, itemId }) {
	// SET STATES
	//[read comments on line 16 - 26 first] Rather than building in an automatic uncheck - we decided to only rely on uncheck happening on render. On render, each list item's checked state will be set by comparing the date last purchased in seconds
	const [isChecked, setIsChecked] = useState(
		Date.now() / 1000 - // Date.now() / 1000 gets the current time in Unix timestamp format, in seconds
			dateLastPurchased?.seconds < // dateLastPurchased?.seconds provides the last purchase time in Unix timestamp format, in seconds
			// Subtracting dateLastPurchased from the current time gives the time difference in seconds
			60 * 60 * 24,
	); // We then compare this difference with 24 hours converted to seconds (60 * 60 * 24)
	// If the time difference is less than 24 hours, isChecked is set to true
	// Otherwise, isChecked is set to false

	// const mounted = useRef(false);

	// EVENT HANDLER
	const handleCheck = () => {
		//Moved updateItem function back into click handler, but BEFORE state setting to avoid async issues we faced earlier (rendering the first useEffect we had on line 42 unecessary)
		//on click, if the state is NOT checked
		if (!isChecked) {
			//update relevant fields in Firestore
			updateItem(listToken, itemId);
		}
		//and set the state (this state setting syntax helps with things like checkboxes that can be changed multiple times back to back, this syntax relies on the previously state is set before changing the state again)
		setIsChecked((prevState) => !prevState);
	};

	//Initially we tried to simplify the 2 useEffect hooks on lines 42 and 56 into one hook here. The syntax line 28 needed to change - date objects that come from Firestore have different syntax that Javascript dates - so we needed to access the seconds property of the Firestore date object and then convert is to milliseconds. This useEffect automatically removed the checkboxes at the set time, but on the uncheck and recheck continued to be buggy because everything that was purchased less than 24 hours ago would automatically recheck on one click.
	// useEffect(() => {
	// 	const currentTime = new Date().getTime();
	// 	const lastPurchasedTime = dateLastPurchased?.seconds * 1000
	// 	const timeDifference = currentTime - lastPurchasedTime;
	// 	const twentyFourHours = 24 * 60 * 60 * 1000;
	// 	if (timeDifference < twentyFourHours) {
	// 		setIsChecked(true);
	// 		const timeLeft = twentyFourHours - timeDifference;
	// 		// setTimeout(() => setIsChecked(false), timeLeft);
	// 		//FOR TESTING 15 SECONDS
	// 		setTimeout(() => setIsChecked(false), 15000);
	// 	} else {
	// 		setIsChecked(false);
	// 	}
	// }, [name, dateLastPurchased]);

	// useEffect(() => {
	// 	if (mounted.current) {
	// 		if (isChecked) {
	// 			//the following lines of code are copied and pasted from the above handleClick function
	// 			// const twentyFourHours = 24 * 60 * 60 * 1000;
	// 			// const uncheckTime = new Date().getTime() + twentyFourHours;
	// 			// localStorage.setItem(`${name}=uncheckTime`, uncheckTime.toString());
	// 			updateItem(listToken, itemId);
	// 		}
	// 	} else {
	// 		mounted.current = true;
	// 	}
	// }, [isChecked, listToken, itemId]);

	// useEffect(() => {
	// 	// GET CHECKBOX STATE FROM LOCAL STORAGE
	// 	const storedUncheckTime = localStorage.getItem(`${name}=uncheckTime`);
	// 	const currentTime = new Date().getTime();

	// 	if (storedUncheckTime && currentTime < Number(storedUncheckTime)) {
	// 		setIsChecked(true);
	// 		const remainingTime = Number(storedUncheckTime) - currentTime;
	// 		// setTimeout(() => setIsChecked(false), remainingTime);
	// 		//FOR TESTING 15 SECONDS
	// 		setTimeout(() => setIsChecked(false), 15000);
	// 	} else {
	// 		// CHECK FIRESTORE FOR ITEMS NOT IN LOCAL STORAGE
	// 		const lastPurchasedTime = new Date(dateLastPurchased).getTime();
	// 		const timeDifference = currentTime - lastPurchasedTime;
	// 		const twentyFourHours = 24 * 60 * 60 * 1000;

	// 		if (timeDifference < twentyFourHours) {
	// 			setIsChecked(true);
	// 			const timeLeft = twentyFourHours - timeDifference;
	// 			// setTimeout(() => setIsChecked(false), timeLeft);
	// 			//FOR TESTING 15 SECONDS
	// 			setTimeout(() => setIsChecked(false), 15000);
	// 		} else {
	// 			setIsChecked(false);
	// 		}
	// 	}
	// }, [name, dateLastPurchased]);

	// useEffect(() => {
	// 	const currentTime = new Date().getTime();
	// 	const lastPurchasedTime = new Date(dateLastPurchased).getTime();
	// 	const timeDifference = currentTime - lastPurchasedTime;
	// 	const twentyFourHours = 24 * 60 * 60 * 1000;
	// 	if (timeDifference < twentyFourHours) {
	// 		setIsChecked(false)
	// 	}
	// }, [dateLastPurchased])

	// SET INTERVAL FOR UNCHECKING BOX AFTER X TIME
	// useEffect(() => {
	// 	let unCheckTimer;
	// 	if (isChecked) {
	// 		unCheckTimer = setInterval(() => {
	// 			setIsChecked(false);
	// 			localStorage.setItem(`${name}=isChecked`, 'false');
	// 		}, 2000);
	// 	}
	// 	return () => {
	// 		if (unCheckTimer) {
	// 			clearTimeout(unCheckTimer);
	// 		}
	// 	};
	// }, [isChecked, name]);

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
