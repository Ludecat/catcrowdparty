import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'

export interface ControlPanelPageProps {
	title?: string
}

const ControlPanelPage: NextPage<ControlPanelPageProps> = (props: ControlPanelPageProps) => {
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

export const getStaticProps: GetStaticProps<ControlPanelPageProps> = async () => {
	return {
		props: {
			title: 'Controlpanel',
		},
	}
}
;(ControlPanelPage as PageWithLayoutType).layout = MainLayout

export default ControlPanelPage
