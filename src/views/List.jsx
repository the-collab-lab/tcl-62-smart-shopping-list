import { useState, useEffect } from 'react';
import { ListItem } from '../components';

export function List({ data }) {
	// state for input
	const [input, setInput] = useState('');
	const [searchData, setSearchData] = useState(data);

	// Handle event
	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleInputClear = () => {
		setInput('');
	};

	useEffect(() => {
		const searchRegex = new RegExp(input, 'i');
		const filteredData = data.filter((item) => searchRegex.test(item.name));
		setSearchData(filteredData);
	}, [data, input]);

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>

			<label htmlFor="input">
				<input
					type="text"
					id="input"
					value={input}
					onChange={handleInputChange}
				/>{' '}
				{/* need to add onChange={} */}
			</label>
			{input.length > 0 ? (
				<button onClick={handleInputClear} value={input}>
					x
				</button>
			) : null}
			<ul>
				{searchData &&
					searchData.map((item, index) => (
						<ListItem key={index} name={item.name} />
					))}
			</ul>
		</>
	);
}
