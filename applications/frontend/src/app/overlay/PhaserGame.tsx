import React from 'react'
import { useEffect } from 'react'
import { useIsMounted } from '../hooks/useIsMounted'
import { styled } from '../styles/Theme'
import Game from './game/Game'

const PhaserDiv = styled.div`
	width: 100%;
	height: 100%;
`

const PhaserGame = () => {
	const isMounted = useIsMounted()
	useEffect(() => {
		if (isMounted) {
			new Game()
		}
	}, [isMounted])

	return <PhaserDiv id="ccp-overlay" />
}

export default PhaserGame
