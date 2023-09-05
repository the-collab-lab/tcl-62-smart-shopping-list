// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

// LOCAL IMPORTS
import './Home.css';
import { getExistingList } from '../api/firebase';

export function Home({ createNewToken, setListToken }) {
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

		const tokenExists = await getExistingList(existingToken);
		if (tokenExists) {
			setListToken(existingToken);
			navigate('/list');
		} else {
			setStatus("That list doesn't exist! Create a new list to get started.");
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
				</label>
				<br />
				<input
					type="text"
					id="existingToken"
					onChange={handleTokenChange}
					value={existingToken}
					placeholder="Enter name of existing list"
				/>
				<button>Submit</button>
			</form>
			{status && <p>{status}</p>}

			<button onClick={handleClick}> Create a new list </button>
		</div>
	);
}
