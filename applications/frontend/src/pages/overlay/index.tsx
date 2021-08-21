import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'
import { Overlay } from '../../app/overlay/Overlay'
import styled from 'styled-components'

export interface OverlayPageProps {
	title?: string
}

const OverlayWrapper = styled.div`
	width: 100%;
	height: 100%;
	background-image: url('/ccp_background_placeholder.jpg');
`

const OverlayPage: NextPage<OverlayPageProps> = (props: OverlayPageProps) => {
	const { title } = props
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<OverlayWrapper>
				<Overlay />
			</OverlayWrapper>
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
