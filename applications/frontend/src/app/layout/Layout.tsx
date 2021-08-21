import React from 'react'
import { styled } from '../styles/Theme'

const StyledLayout = styled.div`
	height: 100%;
	width: 100%;
`

interface MainLayoutProps {
	children: React.ReactNode
}

const MainLayout: React.FunctionComponent<MainLayoutProps> = ({ children }: MainLayoutProps) => {
	return <StyledLayout>{children}</StyledLayout>
}

export default MainLayout
