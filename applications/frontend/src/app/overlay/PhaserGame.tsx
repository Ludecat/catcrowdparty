import React from 'react'
import { useEffect } from 'react'
import { useIsMounted } from '../hooks/useIsMounted'
import { useSocket } from '../hooks/useSocket'
import { styled } from '../styles/Theme'
import Game from './game/Game'

const PhaserDiv = styled.div`
	width: 100%;
	height: 100%;
`

const PhaserGame = () => {
	const isMounted = useIsMounted()
	const { socket } = useSocket()

	useEffect(() => {
		if (isMounted && socket?.connected) {
			new Game(socket, 1080, 1920)
		}
	}, [isMounted, socket])

	return <PhaserDiv id="ccp-overlay" />
}

export default PhaserGame
