// LIBRARY IMPORTS
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Text,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

// LOCAL IMPORTS
import { getExistingList } from '../api/firebase';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

export function Home({ setListToken, listToken }) {
	let navigate = useNavigate();

	// STATES
	const [existingToken, setExistingToken] = useState('');
	const [status, setStatus] = useState(null);

	// EVENT HANDLERS
	const handleClick = () => {
		// const newToken = createNewToken();
		// setListToken(newToken);
		// navigate('/list');
		console.log('Creating new lists is no longer supported.');
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
			bg="brand.off_white"
			direction="column"
			minHeight="calc(100vh - headerHeight - navHeight)"
			flex="1"
		>
			<Box
				p={3}
				display="flex"
				flexDirection="column"
				alignItems="center"
				mb={4}
			>
				<Text
					fontSize={{ base: 'lg', md: 'xl', lg: '2xl', xl: '3xl' }}
					fontWeight="bold"
					color="brand.navy"
					p={2}
					mb={4}
					textAlign="center"
				>
					Know Before You're Low: Predictive Shopping Simplified.
				</Text>
				{listToken && (
					<Text fontSize={{ base: 'md', md: 'lg', lg: 'xl', xl: '2xl' }}>
						You're currently in the '{listToken}' list. You can click 'List' in
						the navigation above to go back to that list. You can create a new
						list or join a different list below.
					</Text>
				)}
			</Box>
			<Flex direction="row" justify="center" align="center" px={20}>
				{/* New List Section */}
				<Box
					p={3}
					display="flex"
					flexDirection="column"
					alignItems="center"
					flexGrow={1}
					flexShrink={1}
				>
					<Text
						fontSize={{ base: 'lg', md: 'xl', lg: '2xl', xl: '3xl' }}
						fontWeight="bold"
						mb={4}
					>
						New List
					</Text>
					<IconButton
						icon={<CheckCircleIcon />}
						aria-label="New list icon"
						size="xl"
						variant="ghost"
						mb={4}
					/>
					<Button
						bg="brand.yellow"
						textColor="brand.navy"
						onClick={handleClick}
						fontSize="lg"
						size="md"
						_hover={{
							bg: 'brand.orange',
							textColor: 'brand.off_white',
						}}
						borderRadius="md"
						aria-label="Click me to create a new list"
					>
						Create new list!
					</Button>
				</Box>
				<Divider orientation="vertical" height="80%" color="brand.navy" />
				{/* Existing List Section */}
				<Box
					p={3}
					display="flex"
					flexDirection="column"
					alignItems="center"
					flexGrow={1}
					flexShrink={1}
				>
					<Text
						fontSize={{ base: 'lg', md: 'xl', lg: '2xl', xl: '3xl' }}
						fontWeight="bold"
						mb={4}
					>
						Existing List
					</Text>
					<FormControl>
						<form onSubmit={handleSubmit}>
							<Flex
								direction="column"
								justify="center"
								align="center"
								gap={2}
								pt={4}
							>
								<FormLabel
									htmlFor="existingToken"
									fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
									size="xl"
								>
									Which list would you like to join?
								</FormLabel>
								<Flex direction="column" maxWidth="400px">
									<Input
										type="text"
										id="existingToken"
										onChange={handleTokenChange}
										value={existingToken}
										placeholder=" List name"
										variant="outline"
										borderColor="brand.yellow"
										borderRadius="md"
										aria-label="Enter list name to join"
									/>
								</Flex>

								<Button
									type="submit"
									bg="brand.yellow"
									textColor="brand.navy"
									onChange={handleTokenChange}
									fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
									size="xl"
									_hover={{
										bg: 'brand.orange',
										textColor: 'brand.off_white',
									}}
									mt={6}
									mb={6}
									p={4}
									borderRadius="md"
									aria-label="Click me to join an existing list"
								>
									Submit
								</Button>
							</Flex>
						</form>

						{status && (
							<Alert status="error">
								{' '}
								<AlertIcon /> {status}
							</Alert>
						)}
					</FormControl>
				</Box>
			</Flex>
			<ArchivalNoticeModal />
		</Flex>
	);
}
