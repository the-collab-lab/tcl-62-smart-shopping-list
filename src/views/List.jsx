import { useState, useEffect } from 'react';
import { ListItem } from '../components';
import { useNavigate } from 'react-router-dom';

export function List({ data }) {
	// State for input
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
			{data && data.length === 0 ? (
				<div>
					<h2>Your list is empty. Get started by adding an item.</h2>
					<p>To add an item to your list, tap the Add Item button below.</p>

					<button onClick={handleClick}> + Add Item </button>
				</div>
			) : (
				<div>
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
									<ListItem key={item.id} name={item.name} />
								))}
						</ul>
					) : (
						<h2>no matches</h2>
					)}
				</div>
			)}
		</>
	);
}
