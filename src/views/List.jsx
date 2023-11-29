// LIBRARY IMPORTS
import { useState, useEffect } from 'react';

// LOCAL IMPORTS
import { ListItem } from '../components';
import { AddItem } from '../components/AddItem.jsx';
import { comparePurchaseUrgency } from '../api/firebase.js';
import {
	Flex,
	Spacer,
	Center,
	VStack,
	Input,
	FormControl,
	Box,
	IconButton,
	StackDivider,
} from '@chakra-ui/react';
import { Search2Icon, CloseIcon } from '@chakra-ui/icons';

export function List({ data, listToken, onOpen, isOpen, onClose }) {
	// state for input
	const [input, setInput] = useState('');
	const [searchData, setSearchData] = useState(data);
	const [isValid, setIsValid] = useState(false);
	const [searchLength, setSearchLength] = useState(1);

	// Handle events
	const handleInputChange = (e) => {
		setInput(e.target.value);
	};
	const handleInputClear = () => {
		setInput('');
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
		<Flex as="div" direction="column" align="center">
			{data && data.length === 0 ? (
				<VStack>
					<Center>
						<h2>Your list is empty. Get started by adding an item.</h2>
					</Center>
					<Center>
						<p>To add an item to your list, tap the Add Item button below.</p>
					</Center>
					<Center>
						<AddItem
							listToken={listToken}
							data={data}
							isOpen={isOpen}
							onClose={onClose}
							onOpen={onOpen}
						/>
					</Center>
				</VStack>
			) : (
				<VStack spacing={4} align="center">
					<FormControl>
						<Center padding="0.5em">
							<AddItem
								listToken={listToken}
								data={data}
								isOpen={isOpen}
								onClose={onClose}
								onOpen={onOpen}
							/>
						</Center>
						<Center align="center">
							<Box
								w="400px"
								bg="brand.off_white"
								boxShadow="md"
								padding="0.5em"
								justifyContent="space-between"
								alignItems="left"
								display="flex"
							>
								<Box mx="auto">
									<Search2Icon size="sm" color="brand.navy" />
								</Box>

								<Input
									placeholder="Search for an item"
									variant="filled"
									focusBorderColor="black"
									size="lg"
									bg="white"
									width="200px"
									type="text"
									value={input}
									onChange={handleInputChange}
									maxLength={searchLength}
								/>

								<Box mx="auto">
									<IconButton
										size="sm"
										color="brand.off_white"
										bg="brand.navy"
										icon={<CloseIcon />}
										onClick={handleInputClear}
									/>
								</Box>
							</Box>
						</Center>
					</FormControl>
					<Spacer />
					<Box w="100%" bg="brand.off_white" boxShadow="md" padding=".5em">
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
