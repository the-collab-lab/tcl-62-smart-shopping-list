// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Flex, Spacer, Button } from '@chakra-ui/react';

// LOCAL IMPORTS
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
		<Flex
			bg="brand.light_green"
			direction="column"
			justifyContent="center"
			minHeight="calc(100vh - headerHeight - navHeight)"
			flex="1"
		>
			<p>Welcome to PredictaCart, your smart shopping list!</p>
			<Spacer />
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
				<Button type="submit">Submit</Button>
			</form>
			{status && <p>{status}</p>}
			<Spacer />
			<Button onClick={handleClick}> Create a new list </Button>
		</Flex>
	);
}
