// LIBRARY IMPORTS
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
	Flex,
	Box,
	Center,
	Image,
	Link,
	Tabs,
	TabList,
	Tab,
} from '@chakra-ui/react';

// LOCAL IMPORTS
import logo from '../images/PredictaCartLogo.png';

export function Layout() {
	const location = useLocation();
	let tabIndex;

	switch (location.pathname) {
		case '/':
			tabIndex = 0;
			break;
		case '/list':
			tabIndex = 1;
			break;
		case '/add-item':
			tabIndex = 2;
			break;
		default:
			tabIndex = 0;
	}

	return (
		<Flex direction="column" h="100vh">
			<Flex
				as="header"
				justify="space-between"
				alignItems="center"
				p={4}
				bgGradient="linear(to-r, #A1c181, #Fcca46, #fe7f2d)"
			>
				{/* Logo that navigates to the home page */}
				<Link as={NavLink} to="/">
					<Image src={logo} alt="PredictaCart Logo" h="60px" />
				</Link>

				<Center w={['100%', '50%']}>
					<Tabs
						variant="soft-rounded"
						size="lg"
						w="100%"
						direction={['column', 'row']}
						index={tabIndex}
					>
						<TabList w="100%">
							<Tab
								flex="1"
								fontSize="xl"
								_selected={{ color: 'brand.navy', bg: 'brand.light_green' }}
							>
								<Link as={NavLink} to="/">
									Home
								</Link>
							</Tab>
							<Tab
								flex="1"
								fontSize="xl"
								_selected={{ color: 'brand.navy', bg: 'brand.light_green' }}
							>
								<Link as={NavLink} to="/list">
									List
								</Link>
							</Tab>
							<Tab
								flex="1"
								fontSize="xl"
								_selected={{ color: 'brand.navy', bg: 'brand.light_green' }}
							>
								<Link as={NavLink} to="/add-item">
									Add Item
								</Link>
							</Tab>
						</TabList>
					</Tabs>
				</Center>

				<Box />
			</Flex>

			<Flex as="main" flex="1" direction="column">
				<Outlet />
			</Flex>
		</Flex>
	);
}
