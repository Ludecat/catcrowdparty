import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'

export interface OverlayPageProps {
	title?: string
}

const OverlayPage: NextPage<OverlayPageProps> = (props: OverlayPageProps) => {
	const { title } = props
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div>{title}</div>
		</>
	)
}

export const getStaticProps: GetStaticProps<OverlayPageProps> = async () => {
	return {
		props: {
			title: 'Overlay',
		},
	}
}
;(OverlayPage as PageWithLayoutType).layout = MainLayout

export default OverlayPage
