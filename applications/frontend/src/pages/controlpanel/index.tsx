import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'
import { Button } from '../../app/components/Button'
import { TextArea } from '../../app/components/TextArea'
import { CheckBoxToggle } from '../../app/components/CheckBoxToggle'

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
			<header>CONTROL PANEL</header>
			<div>
				<div>
					<Button
						onClick={(e) => console.log(e.currentTarget.value)}
						value="I am LudeCat"
						title="I am LudeCat"
					></Button>
				</div>

				<div>
					<TextArea onChange={(e) => console.log(e.currentTarget.value)} />
				</div>

				<div>
					<CheckBoxToggle id="ludecat-checkbox-01" onChange={(e) => console.log(e.currentTarget.checked)} />
				</div>
			</div>
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
