import { useState } from 'react';
import { ListItem } from '../components';

export function List({ data }) {
	const [searchField, setSearchField] = useState('');
	const [searchMatch, setSearchMatch] = useState(data);

	const handleUserSearch = (event) => {
		const searchTerm = event.target.value;
		setSearchField(searchTerm);
	};

	const handleUserClear = () => {
		setSearchField('');
		setSearchMatch(data);
		console.log(searchField);
	};

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>

			<input
				name="searchInput"
				type="text"
				value={searchField}
				onChange={handleUserSearch}
			/>

			<button onClick={handleUserClear} value={searchField}>
				Clear Search Field
			</button>
			{/* <ul>
				{data &&
					data.map((item, index) => (
					<ListItem key={index} name={item.name} />))}
			</ul> */}
			<ul>
				{searchMatch.map((item, index) => (
					<ListItem key={index} name={item.name} />
				))}
			</ul>
		</>
	);
}
