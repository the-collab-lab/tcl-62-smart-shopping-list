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
		const currentIsChecked = !isChecked;
		setIsChecked(currentIsChecked);
		await updateItem(listToken, e.target.name);
		localStorage.setItem(
			`${name}=isChecked`,
			currentIsChecked ? 'true' : 'false',
		);
	};

	useEffect(() => {
		const storedCheck = localStorage.getItem(`${name}=isChecked`);
		if (storedCheck !== null) {
			setIsChecked(storedCheck === 'true');
		}
	}, [name]);

	useEffect(() => {
		let unCheckTimer;
		if (isChecked) {
			unCheckTimer = setInterval(() => {
				setIsChecked(false);
				localStorage.setItem(`${name}=isChecked`, 'false');
			}, 2000);
		}
		return () => {
			if (unCheckTimer) {
				clearTimeout(unCheckTimer);
			}
		};
	}, [isChecked, name]);

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
