/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '../app/styles/global.styles'
import { theme } from '../app/styles/Theme'

function App({ Component, pageProps }) {
	const Layout = Component.layout ? Component.layout : React.Fragment
	return (
		<React.Fragment>
			<GlobalStyle />
			<ThemeProvider theme={theme}>
				{/**
				 * Produces the following warnings:
				 * Warning: Invalid prop `statusCode` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.
				 */}
				<Layout {...pageProps}>
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		</React.Fragment>
	)
}

export default App
