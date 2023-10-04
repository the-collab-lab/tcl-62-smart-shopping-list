// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
	Flex,
	Image,
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
			minHeight="calc(100vh - headerHeight - navHeight)"
			flex="1"
		>
			<Box p={6} display="flex" flexDirection="column" alignItems="center">
				<Text
					fontSize={{ base: '2xl', md: '3xl', lg: '4xl', xl: '5xl' }}
					fontWeight="bold"
					color="brand.navy"
					p={4}
					mb={8}
				>
					Say hello to stress-free shopping and welcome what truly matters.
				</Text>
				<Image
					src={'src/images/PredictaCartLogoAltColor.png'}
					boxSize="150px"
					objectFit="cover"
					alt="Shopping Cart with the name Predicta Cart"
					mb={8}
				/>

				<Button
					bg="brand.yellow"
					textColor="brand.navy"
					variant="soft-rounded"
					onClick={handleClick}
					fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
					size="xl"
					_hover={{
						bg: 'brand.orange',
						textColor: 'brand.off_white',
					}}
					mt={6} // Increase the top margin for more spacing at the top.
					mb={6} // Increase the bottom margin for more spacing at the bottom.
					p={4} // Add padding to increase the space within the button.
					borderRadius="md" // Add a rounded border for better accessibility.
					aria-label="Click me to create a new list" // Add an aria-label for screen readers.
				>
					Create a new list
				</Button>
			</Box>
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
						<Text>- or -</Text>
						<FormLabel
							htmlFor="existingToken"
							fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
							size="xl"
						>
							Join an existing list!
						</FormLabel>
						<Flex
							direction="column" // You can keep this as 'column' for vertical alignment
							maxWidth="400px" // Limit the input's width
						>
							<InputGroup mb={6} size="lg">
								<Input
									type="text"
									id="existingToken"
									onChange={handleTokenChange}
									value={existingToken}
									placeholder=" Enter list name to join"
									variant="outline"
									borderColor="brand.yellow"
									borderRadius="md"
									aria-label="Enter list name to join" // ARIA label for the input field
								/>
							</InputGroup>
						</Flex>

						<Button
							bg="brand.yellow"
							textColor="brand.navy"
							onClick={handleClick}
							fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
							size="xl"
							_hover={{
								bg: 'brand.orange',
								textColor: 'brand.off_white',
							}}
							mt={6}
							mb={6}
							p={4} // Add padding to increase the space within the button.
							borderRadius="md" // Add a rounded border for better accessibility.
							aria-label="Click me to create a new list" // Add an aria-label for screen readers.
						>
							Submit
						</Button>
					</Flex>
				</form>
				{status && <p>{status}</p>}
			</FormControl>
		</Flex>
	);
}
