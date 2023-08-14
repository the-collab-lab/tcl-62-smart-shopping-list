import './ListItem.css';

export function ListItem({ name }) {
	return <li className="ListItem">{name}</li>;
	// <ul>
	// 	{
	// 		name.map((item) => (
	// 			<ListItem name={item.name} />

	// 		))}
	// </ul>
}

/*

Fetch Data from the Database:

Render the Data:

**/
