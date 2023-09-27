// LIBRARY IMPORTS
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// LOCAL IMPORTS
import App from './App.jsx';

const theme = extendTheme({
	colors: {
		brand: {
			off_white: '#FAF0CA',
			navy: '#233D4D',
			yellow: '#FCCA46',
			orange: '#FE7F2D',
			light_green: '#A1C181',
			dark_green: '#619B8A',
		},
	},
	fonts: {
		heading: "'DM Sans', sans-serif",
		body: "'DM Sans', sans-serif",
	},
});

function AppHolder() {
	return (
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	);
}

export default AppHolder;
