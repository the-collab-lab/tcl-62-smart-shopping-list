// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import React, { useState } from 'react';

// LOCAL IMPORTS
import './Home.css';
import { getItems } from '../api/firebase';

export function Home({ createNewToken, setListToken, listToken }) {
	let navigate = useNavigate();

	// STATES
	const [existingToken, setExistingToken] = useState('');
	const [status, setStatus] = useState(null);

	// EVENT HANDLERS
	const handleClick = () => {
		const newToken = createNewToken();
		//save the token using setListToken function asign to listToken
		setListToken(newToken);
		//navigate to the list
		navigate('/list');
	};

	const handleTokenChange = (e) => {
		setExistingToken(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const tokenExists = await getItems(existingToken);
			if (tokenExists) {
				setListToken(existingToken);
				navigate('/list');
			} else {
				setStatus(false);
			}
			console.log(`existingToken: ${existingToken}`);
			setExistingToken('');
			console.log(`listToken on submit: ${listToken}`);
		} catch (error) {
			throw error;
		}
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor="existingToken">
					Which list would you like to join?
					<br />
					<input
						type="text"
						id="existingToken"
						onChange={handleTokenChange}
						value={existingToken}
					/>
				</label>
				<button>Submit</button>
			</form>
			{status && <p>{status}</p>}

			<button onClick={handleClick}> Create a new list </button>
		</div>
	);
}
