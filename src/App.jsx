import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

import { generateToken } from '@the-collab-lab/shopping-list-utils';

import { AddItem, Home, Layout, List } from './views';

import { useShoppingListData } from './api';

import { useStateWithStorage } from './utils';

export function App() {
	/**
	 * This custom hook takes a token pointing to a shopping list
	 * in our database and syncs it with localStorage for later use.
	 * Check ./utils/hooks.js for its implementation.
	 *
	 * We use `my test list` by default so we can see the list
	 * of items that was prepopulated for this project.
	 * We'll later set this to `null` by default (since new users do not
	 * have tokens), and use `setListToken` when we allow a user
	 * to create and join a new list.
	 */

	const [listToken, setListToken] = useStateWithStorage(
		'tcl-shopping-list-token',
		null,
	);

	/**
	 * This custom hook takes our token and fetches the data for our list.
	 * Check ./api/firestore.js for its implementation.
	 */
	const data = useShoppingListData(listToken);

	//This function creates a new token by invoking the 'generateToken' function and returning the generated token.
	const createNewToken = () => {
		const newToken = generateToken();
		return newToken;
	};

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							listToken ? (
								<Navigate to="/list" />
							) : (
								<Home
									createNewToken={createNewToken}
									setListToken={setListToken}
								/>
							)
						}
					/>
					<Route
						path="/list"
						element={
							listToken ? (
								<List data={data} listToken={listToken} />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route path="/add-item" element={<AddItem />} />
				</Route>
			</Routes>
		</Router>
	);
}
