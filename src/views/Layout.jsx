import { Outlet, NavLink } from 'react-router-dom';
import {
	Flex,
	Center,
	Heading,
	Link,
	Tabs,
	TabList,
	Tab,
} from '@chakra-ui/react';

export function Layout() {
	return (
		<Flex as="div" direction="column" h="100vh">
			<Center as="header" bg="brand.floral_white" p={5} boxShadow="md">
				<Heading as="h1" size="xl" color="brand.gunmetal_blue">
					PredictaCart
				</Heading>
			</Center>

			<Center as="nav" p={4} bg="brand.jasmine" boxShadow="md">
				<Tabs variant="soft-rounded" colorScheme="green" size="lg">
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
			</Center>

			<Flex as="main" flex="1" direction="column">
				<Outlet />
			</Flex>
		</Flex>
	);
}
