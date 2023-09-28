import { Outlet, NavLink } from 'react-router-dom';
import { Link, Tabs, TabList, Tab } from '@chakra-ui/react';

import './Layout.css';

/**
 * TODO: The links defined in this file don't work!
 *
 * Instead of anchor element, they should use a component
 * from `react-router-dom` to navigate to the routes
 * defined in `App.jsx`.
 */

export function Layout() {
	return (
		<>
			<div className="Layout">
				<header className="Layout-header">
					<h1>PredictaCart</h1>
				</header>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<Tabs variant="soft-rounded" colorScheme="green">
						<TabList>
							<Tab>
								<Link as={NavLink} to="/">
									Home
								</Link>
							</Tab>
							<Tab>
								<Link as={NavLink} to="/list">
									List
								</Link>
							</Tab>
							<Tab>
								<Link as={NavLink} to="/add-item">
									Add Item
								</Link>
							</Tab>
						</TabList>
					</Tabs>
				</nav>
			</div>
		</>
	);
}
