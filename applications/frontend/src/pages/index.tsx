import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import PageWithLayoutType from '../app/layout/PageWithLayout'
import MainLayout from '../app/layout/Layout'

export interface InitialAppProps {
	title?: string
}

const IndexPage: NextPage<InitialAppProps> = (props: InitialAppProps) => {
	const { title } = props
	return (
		<>
			<Head>
				<title>Index Page</title>
			</Head>
			<div>{title}</div>
		</>
	)
}

export const getStaticProps: GetStaticProps<InitialAppProps> = async () => {
	return {
		props: {
			title: 'index page staticTitleProps',
		},
	}
}
;(IndexPage as PageWithLayoutType).layout = MainLayout

export default IndexPage
