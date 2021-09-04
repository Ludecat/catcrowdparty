import React from 'react'
import Document, { DocumentContext, Html, Head, Main, NextScript, DocumentInitialProps } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const fontDisplayOptions = {
	swap: 'swap',
	auto: 'auto',
	block: 'block',
	fallback: 'fallback',
	optional: 'optional',
}

const fontDisplay = fontDisplayOptions.block

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const sheet = new ServerStyleSheet()
		const view = ctx.renderPage

		try {
			ctx.renderPage = () =>
				view({
					// eslint-disable-next-line react/display-name
					enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
				})

			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: (
					<React.Fragment>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</React.Fragment>
				),
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link
						href={`https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=${fontDisplay}`}
						rel="stylesheet"
					></link>
				</Head>
				<body id="ccp-body">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
