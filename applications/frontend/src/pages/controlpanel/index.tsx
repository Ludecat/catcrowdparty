import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'
import { ControlPanelGrid } from '../../app/components/controlpanel/ControlPanelGrid'
import { styled } from '../../app/styles/Theme'

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
			<ControlPanelPageWrapper>
				<ControlPanelGrid />
			</ControlPanelPageWrapper>
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

const ControlPanelPageWrapper = styled.div`
	padding: ${(p) => p.theme.space.xl}px;
`

export default ControlPanelPage
