import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

	html {
		width: 100%;
		height: 100%;
	}

	body {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: 'Roboto', sans-serif;
		background-image: url('/ccp_background_placeholder.jpg');
	}

	#__next {
		width: 100%;
		height: 100%;
	}

	* {
		box-sizing: border-box;
	}
`
