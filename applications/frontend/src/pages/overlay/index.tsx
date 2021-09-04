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
	// background-image: url('/ccp_bg_placeholder.png');
	background-repeat: no-repeat;
	width: 1920px;
	height: 1080px;
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
