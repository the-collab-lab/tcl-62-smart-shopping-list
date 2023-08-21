import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import React, { useState } from 'react';

export function Home() {
	let navigate = useNavigate();

	const { setListToken } = useState('');

	const createNewToken = () => {
		const newToken = generateToken();
		if (localStorage.getItem('token') === null) {
			localStorage.setItem('token', newToken);
			//save the token using setListToken function
			setListToken(newToken);
		}
		navigate('/list');
	};
	//this is redirect to list if we have a token
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
