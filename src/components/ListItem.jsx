//LIBRARY IMPORTS
import React, { useState, useEffect, useRef } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken, dateLastPurchased, itemId }) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(false);
	const mounted = useRef(false);

	// EVENT HANDLER
	const handleCheck = () => {
		setIsChecked(!isChecked);
	};

	useEffect(() => {
		if (mounted.current) {
			if (isChecked) {
				//the following lines of code are copied and pasted from the above handleClick function
				const twentyFourHours = 24 * 60 * 60 * 1000;
				const uncheckTime = new Date().getTime() + twentyFourHours;
				localStorage.setItem(`${name}=uncheckTime`, uncheckTime.toString());
				updateItem(listToken, itemId);
			}
		} else {
			mounted.current = true;
		}
	}, [isChecked, listToken, itemId, name]);

	useEffect(() => {
		// GET CHECKBOX STATE FROM LOCAL STORAGE
		const storedUncheckTime = localStorage.getItem(`${name}=uncheckTime`);
		const currentTime = new Date().getTime();

		if (storedUncheckTime && currentTime < Number(storedUncheckTime)) {
			setIsChecked(true);
			const remainingTime = Number(storedUncheckTime) - currentTime;
			// setTimeout(() => setIsChecked(false), remainingTime);
			//FOR TESTING 15 SECONDS
			setTimeout(() => setIsChecked(false), 15000);
		} else {
			// CHECK FIRESTORE FOR ITEMS NOT IN LOCAL STORAGE
			const lastPurchasedTime = new Date(dateLastPurchased).getTime();
			const timeDifference = currentTime - lastPurchasedTime;
			const twentyFourHours = 24 * 60 * 60 * 1000;

			if (timeDifference < twentyFourHours) {
				setIsChecked(true);
				const timeLeft = twentyFourHours - timeDifference;
				// setTimeout(() => setIsChecked(false), timeLeft);
				//FOR TESTING 15 SECONDS
				setTimeout(() => setIsChecked(false), 15000);
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
