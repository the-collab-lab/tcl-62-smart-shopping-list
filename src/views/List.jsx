import { useState, useEffect } from 'react';
import { ListItem } from '../components';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api/firebase.js';
import {
	Flex,
	Spacer,
	Center,
	Stack,
	VStack,
	Button,
	Input,
	FormControl,
	Box,
	IconButton,
} from '@chakra-ui/react';
import { Search2Icon, CloseIcon } from '@chakra-ui/icons';

export function List({ data, listToken }) {
	// state for input
	const [input, setInput] = useState('');
	const [searchData, setSearchData] = useState(data);
	const [isValid, setIsValid] = useState(false);
	const [searchLength, setSearchLength] = useState(1);
	const navigate = useNavigate();

	// Handle events
	const handleInputChange = (e) => {
		setInput(e.target.value);
	};
	const handleInputClear = () => {
		setInput('');
	};
	const handleClick = () => {
		navigate('/add-item');
	};

	useEffect(() => {
		setSearchData(comparePurchaseUrgency(data));
	}, [data]);

	useEffect(() => {
		const searchRegex = new RegExp(
			input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
			'i',
		);
		const filteredData = data.filter((item) => searchRegex.test(item.name));
		setSearchData(comparePurchaseUrgency(filteredData));
	}, [data, input]);

	useEffect(() => {
		if (searchData.length > 0) {
			setIsValid(true);
			setSearchLength(50);
		} else {
			setIsValid(false);
			setSearchLength(0);
		}
	}, [searchData, data.length]);

	return (
		<Flex as="div" direction="column" flex="1">
			{data && data.length === 0 ? (
				<VStack>
					<Center>
						<h2>Your list is empty. Get started by adding an item.</h2>
					</Center>
					<Center>
						<p>To add an item to your list, tap the Add Item button below.</p>
					</Center>
					<Center>
						<Button onClick={handleClick}> + Add Item </Button>
					</Center>
				</VStack>
			) : (
				<VStack marginLeft="5rem">
					<FormControl>
						<Box
							w="75%"
							bg="brand.off_white"
							boxShadow="md"
							padding=".5em"
							justifyContent="space-between"
							alignItems="left"
						>
							<Search2Icon />
							<Input
								placeholder="Search For An Item!"
								variant="filled"
								focusBorderColor="black"
								size="xlg"
								bg="white"
								width="auto"
								type="text"
								value={input}
								onChange={handleInputChange}
								maxLength={searchLength}
							/>
							{input.length > 0 && (
								<IconButton
									size="lg"
									bg="brand.navy"
									icon={<CloseIcon />}
									onClick={handleInputClear}
								/>
							)}
						</Box>
					</FormControl>
					<Spacer />
					<Box w="75%" bg="brand.off_white" boxShadow="md" padding=".5em">
						{isValid ? (
							<ul>
								{searchData &&
									searchData.map((item) => (
										<ListItem
											key={item.id}
											name={item.name}
											itemId={item.id}
											dateCreated={item.dateCreated}
											dateLastPurchased={item.dateLastPurchased}
											dateNextPurchased={item.dateNextPurchased}
											totalPurchases={item.totalPurchases}
											listToken={listToken}
											// width="auto"
										/>
									))}
							</ul>
						) : (
							<h2>no matches</h2>
						)}
					</Box>
					<Spacer />
				</VStack>
			)}
		</Flex>
	);
}
