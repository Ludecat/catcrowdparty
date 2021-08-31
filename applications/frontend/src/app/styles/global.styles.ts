import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

	html {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}


	#ccp-overlay canvas {
		display: block;
	}

	body {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: 'Roboto', sans-serif;
	}

	#__next {
		width: 100%;
		height: 100%;
	}

	p {
		margin: 0;
		padding: 0;
	}

	* {
		box-sizing: border-box;
	}
`
