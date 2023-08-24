import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import React, { useState } from 'react';

export function Home({ createNewToken, setListToken }) {
	let navigate = useNavigate();

	const handleClick = () => {
		const newToken = createNewToken();
		//save the token using setListToken function asign to listToken
		setListToken(newToken);
		//navigate to the list
		navigate('/list');
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={handleClick}> Create a new list </button>
		</div>
	);
}
