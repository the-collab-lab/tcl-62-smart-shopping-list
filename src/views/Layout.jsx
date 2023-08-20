import { Outlet, NavLink } from 'react-router-dom';

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
					<h1>Smart shopping list</h1>
				</header>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<div className="Nav-container">
						<NavLink
							to="/"
							className={({ isActive, isPending }) =>
								isPending ? 'pending' : isActive ? 'active' : ''
							}
						>
							Home
						</NavLink>
						<NavLink
							to="/list"
							className={({ isActive, isPending }) =>
								isPending ? 'pending' : isActive ? 'active' : ''
							}
						>
							List
						</NavLink>
						<NavLink
							to="/add-item"
							className={({ isActive, isPending }) =>
								isPending ? 'pending' : isActive ? 'active' : ''
							}
						>
							Add Item
						</NavLink>
					</div>
				</nav>
			</div>
		</>
	);
}
