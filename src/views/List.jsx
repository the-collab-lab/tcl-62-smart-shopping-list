import { useState, useEffect } from 'react';
import { ListItem } from '../components';

export function List({ data, listToken }) {
	// state for input
	const [input, setInput] = useState('');
	const [searchData, setSearchData] = useState(data);
	const [isValid, setIsValid] = useState(false);
	const [searchLength, setSearchLength] = useState(1);
	// Handle event
	const handleInputChange = (e) => {
		setInput(e.target.value);
	};
	const handleInputClear = () => {
		setInput('');
	};
	useEffect(() => {
		const searchRegex = new RegExp(
			input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
			'i',
		);
		const filteredData = data.filter((item) => searchRegex.test(item.name));
		setSearchData(filteredData);
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
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<form>
				Search for your item:
				<input
					type="text"
					value={input}
					onChange={handleInputChange}
					maxLength={searchLength}
				/>
				{input.length > 0 && <button onClick={handleInputClear}>x</button>}
			</form>
			{isValid ? (
				<ul>
					{searchData &&
						searchData.map((item) => (
							<ListItem
								key={item.id}
								itemId={item.id}
								name={item.name}
								dateLastPurchased={item.dateLastPurchased}
								listToken={listToken}
							/>
						))}
				</ul>
			) : (
				<h2>no matches</h2>
			)}
		</>
	);
}
