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
			off_white: '#FAF0CA',
			navy: '#233D4D',
			yellow: '#FCCA46',
			orange: '#FE7F2D',
			light_green: '#A1C181',
			dark_green: '#619B8A',
			cherry_red: '#B11B34',
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
