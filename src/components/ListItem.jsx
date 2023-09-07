//LIBRARY IMPORTS
import React, { useState, useEffect } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken, dateLastPurchased, itemId }) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(false);

	// EVENT HANDLER
	const handleCheck = async (e) => {
		const currentIsChecked = !isChecked;
		setIsChecked(currentIsChecked);
		const twentyFourHours = 24 * 60 * 60 * 1000;
		const uncheckTime = new Date().getTime() + twentyFourHours;
		// setIsChecked(!isChecked);
		await updateItem(listToken, itemId);
		localStorage.setItem(`${name}=uncheckTime`, uncheckTime.toString());
	};

	// STORE CHECKBOX STATE IN LOCALSTORAGE
	useEffect(() => {
		const storedUncheckTime = localStorage.getItem(`${name}=uncheckTime`);
		const currentTime = new Date().getTime();

		if (storedUncheckTime && currentTime < Number(storedUncheckTime)) {
			setIsChecked(true);
			const remainingTime = Number(storedUncheckTime) - currentTime;
			setTimeout(() => setIsChecked(false), remainingTime);
		} else {
			// CHECK FIRESTORE FOR ITEMS NOT IN LOCAL STORAGE
			const lastPurchasedTime = new Date(dateLastPurchased).getTime();
			const timeDifference = currentTime - lastPurchasedTime;
			const twentyFourHours = 24 * 60 * 60 * 1000;

			if (timeDifference < twentyFourHours) {
				setIsChecked(true);
				const timeLeft = twentyFourHours - timeDifference;
				setTimeout(() => setIsChecked(false), timeLeft);
			} else {
				setIsChecked(false);
			}
		}
	}, [name, dateLastPurchased]);

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
