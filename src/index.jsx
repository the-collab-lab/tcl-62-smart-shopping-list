// LIBRARY IMPORTS
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/provider';
import { CSSReset } from '@chakra-ui/css-reset';
import { extendTheme } from '@chakra-ui/react';

//LOCAL IMPORTS
import { App } from './App';
import './index.css';
import { Fonts } from './Fonts';

const theme = extendTheme({
	colors: {
		brand: {
			floral_white: '#FFFAF0',
			gunmetal_blue: '#082B35',
			tea_green: '#C5F9D7',
			jordy_blue: '#A1C8F7',
			jasmine: '#F7D486',
			light_coral: '#F27A7D',
			grey_violet: '#6C5C70',
		},
	},
	fonts: {
		heading: 'Open Sans',
		body: 'Raleway',
	},
});

const root = createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ChakraProvider theme={theme}>
			<CSSReset />
			<Fonts />
			<App />
		</ChakraProvider>
	</StrictMode>,
);
