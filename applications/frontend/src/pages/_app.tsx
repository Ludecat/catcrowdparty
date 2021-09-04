/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
import { AppProps } from 'next/dist/shared/lib/router/router'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { SocketProvider } from '../app/provider/SocketProvider'
import { GlobalStyle } from '../app/styles/global.styles'
import { theme } from '../app/styles/Theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GlobalStateProvider } from '../app/provider/GlobalStateProvider'

function App({ Component, pageProps }: AppProps) {
	// Casting to any workaround for static prop

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Layout = (Component as any).layout ? (Component as any).layout : React.Fragment

	return (
		<React.Fragment>
			<GlobalStyle />
			<SocketProvider>
				<GlobalStateProvider>
					<ThemeProvider theme={theme}>
						{/**
						 * Produces the following warnings:
						 * Warning: Invalid prop `statusCode` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.
						 */}
						<Layout {...pageProps}>
							<Component {...pageProps} />
						</Layout>
					</ThemeProvider>
				</GlobalStateProvider>
			</SocketProvider>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				theme="dark"
				pauseOnHover
			/>
		</React.Fragment>
	)
}

export default App
