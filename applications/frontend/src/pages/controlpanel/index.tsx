import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { ControlPanelGrid } from '../../app/components/controlpanel/ControlPanelGrid'
import { styled } from '../../app/styles/Theme'
import { useGlobalState } from '../../app/hooks/useGlobalState'

export interface ControlPanelPageProps {
	title?: string
}

const ControlPanelPage: NextPage<ControlPanelPageProps> = (props: ControlPanelPageProps) => {
	const { title } = props
	const { globalState } = useGlobalState()

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<ControlPanelPageWrapper>
				{globalState && <ControlPanelGrid globalState={globalState!} />}
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
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.l}px;
	background-color: black;
	height: 100%;
	background-color: #363636;
	background-image: linear-gradient(
			45deg,
			hsla(0, 0%, 0%, 0.25) 25%,
			transparent 25%,
			transparent 75%,
			hsla(0, 0%, 0%, 0.25) 75%,
			hsla(0, 0%, 0%, 0.25)
		),
		linear-gradient(
			45deg,
			hsla(0, 0%, 0%, 0.25) 25%,
			transparent 25%,
			transparent 75%,
			hsla(0, 0%, 0%, 0.25) 75%,
			hsla(0, 0%, 0%, 0.25)
		);
	background-position: 0 0, 2px 2px;
	background-size: 4px 4px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

export default ControlPanelPage
