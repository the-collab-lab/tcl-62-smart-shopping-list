//LIBRARY IMPORTS
import React, { useState, useEffect } from 'react';

// LOCAL IMPORTS
import './ListItem.css';
import { updateItem } from '../api/firebase.js';

export function ListItem({ name, listToken, dateLastPurchased }) {
	// SET STATES
	const [isChecked, setIsChecked] = useState(false);

	// EVENT HANDLER
	const handleCheck = async (e) => {
		// added this variable to correctly store the value of the state
		const currentIsChecked = !isChecked;
		setIsChecked(currentIsChecked);
		await updateItem(listToken, e.target.name);
		// added this line and the useEffect beneath it to store the state of the checkbox in the local storage (it was resetting upon page refreshes before)
		localStorage.setItem(
			`${name}=isChecked`,
			currentIsChecked ? 'true' : 'false',
		);
	};
	// maintains the state of the checkbox despite refreshes
	useEffect(() => {
		const storedCheck = localStorage.getItem(`isChecked-${name}`);
		if (storedCheck !== null) {
			setIsChecked(storedCheck === 'true');
		}
	}, [name]);
	// useEffect to set an interval of time for the checkbox to uncheck itself. I read the MDN documentation you sent on setTimeout and it was very helpful (ty), that doc recommended using setInterval for our purposes
	useEffect(() => {
		//declare variable for timer
		let unCheckTimer;

		// check state of checkbox
		if (isChecked) {
			unCheckTimer = setInterval(() => {
				// state checkbox should be after desired interval
				setIsChecked(false);
				// desired interval, presently set to 2 seconds for testing puposes
			}, 2000);
		}
		// clears the timer so it will run again if checked after !isChecked is true again
		return () => {
			if (unCheckTimer) clearTimeout(unCheckTimer);
		};
	}, [isChecked]);
	// useEffect(() => {
	// 	const currentTime = new Date().getTime();
	// 	const lastPurchasedTime = new Date(dateLastPurchased).getTime();
	// 	const timeDifference = currentTime - lastPurchasedTime;
	// 	const twentyFourHours = 24 * 60 * 60 * 1000;
	// 	if (timeDifference < twentyFourHours) {
	// 		setIsChecked(false)
	// 	}

	// })

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
