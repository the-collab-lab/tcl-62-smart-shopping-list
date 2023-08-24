import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import React, { useState } from 'react';

export function Home() {
	// useNavigate hook is needed to navigate to different routes within the app
	let navigate = useNavigate();

	// initialize a listToken using useState hook
	//listToken holds the value of a token, and setListToken is the function to update its value.
	const [listToken, setListToken] = useState('');

	//declered a funtion
	const createNewToken = () => {
		// generating a new token
		const newToken = generateToken();
		// validation if not token stored in database
		if (localStorage.getItem('token') === null) {
			// new token is stored
			localStorage.setItem('token', newToken);
			//save the token using setListToken function asign to listToken
			setListToken(newToken);
		}
		//navigate to the list
		navigate('/list');
	};
	//id token is stored in localStorage then navigate to list
	if (localStorage.getItem('token')) {
		return navigate('/list');
	}
	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}> Create a new list </button>
		</div>
	);
}
