// LIBRARY IMPORTS
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
	Flex,
	Center,
	Heading,
	Image,
	Link,
	Tabs,
	TabList,
	Tab,
} from '@chakra-ui/react';

// LOCAL IMPORTS
import logo from '../images/PredictaCartLogoAltColor.png';

export function Layout() {
	const location = useLocation();
	const isHomePage = location.pathname === '/';
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
				<Link as={NavLink} to="/">
					<Image src={logo} alt="PredictaCart Logo" h="60px" />
				</Link>
				{isHomePage && (
					<Center as="header" bg="brand.off_white" p={5} boxShadow="md">
						<Heading
							as="h1"
							size={isHomePage ? '4xl' : 'xl'}
							color="brand.navy"
						>
							PredictaCart
						</Heading>
					</Center>
				)}
				{isHomePage ? null : (
					<Center as="nav" p={4} bg="brand.yellow" boxShadow="md">
						<Tabs
							variant="soft-rounded"
							size="lg"
							w="100%"
							direction={['column', 'row']}
							index={tabIndex}
						>
							<TabList w="100%">
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
					</Center>
				)}
			</Flex>

			<Flex as="main" flex="1" direction="column">
				<Outlet />
			</Flex>
		</Flex>
	);
}
