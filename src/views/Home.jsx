// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
	Flex,
	Spacer,
	Button,
	Text,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
} from '@chakra-ui/react';

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
			align="center"
			minHeight="calc(100vh - headerHeight - navHeight)"
			flex="1"
		>
			<Box p={4} textAlign="center">
				<Text fontSize="3xl" as="b" color="brand.navy">
					Say hello to stress-free shopping and welcome what truly matters.
				</Text>
			</Box>
			<Box p={4} align="center">
				<Button
					bg="brand.off_white"
					textColor="brand.navy"
					colorScheme="yellow"
					onClick={handleClick}
					variant="outline"
					fontSize={{ base: 'md', md: 'xl' }}
					size="lg"
					_hover={{ bg: 'brand.navy', textColor: 'brand.off_white' }}
					mt={25}
				>
					Create a new list
				</Button>
			</Box>

			<Spacer />
			<FormControl>
				<form onSubmit={handleSubmit}>
					<Flex
						bg="brand.light_green"
						direction="column"
						justify="center"
						align="center"
						gap={2}
						pt={4}
					>
						<FormLabel
							htmlFor="existingToken"
							fontSize={{ base: 'md', md: 'xl' }}
							size="lg"
						>
							Join an existing list!
						</FormLabel>
						<Flex
							direction="column" // You can keep this as 'column' for vertical alignment
							align="center" // Center the input horizontally
							maxWidth="400px" // Limit the input's width
						>
							<InputGroup size="md">
								<Input
									type="text"
									id="existingToken"
									onChange={handleTokenChange}
									value={existingToken}
									placeholder="Enter list name to join"
								/>
							</InputGroup>
						</Flex>

						<Button
							type="submit"
							bg="brand.off_white"
							textColor="brand.navy"
							onClick={handleClick}
							variant="outline"
							fontSize={{ base: 'md', md: 'xl' }}
							size="lg"
							_hover={{ bg: 'brand.navy', textColor: 'brand.off_white' }}
							mt={25}
						>
							Submit
						</Button>
					</Flex>
				</form>
				{status && <p>{status}</p>}
			</FormControl>
			<Spacer />
		</Flex>
	);
}
