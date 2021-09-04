import React from 'react'
import { useEffect } from 'react'
import { useGlobalState } from '../hooks/useGlobalState'
import { useIsMounted } from '../hooks/useIsMounted'
import { useSocket } from '../hooks/useSocket'
import { styled } from '../styles/Theme'
import { Game } from './game/Game'

const PhaserDiv = styled.div`
	width: 100%;
	height: 100%;
`

export const PhaserGame = () => {
	const isMounted = useIsMounted()
	const { socket } = useSocket()
	const { globalState } = useGlobalState()

	useEffect(() => {
		if (isMounted && socket && globalState) {
			new Game(socket, 1080, 1920, globalState)
		}
		// at this point we can be sure that globalState and socketIo connectin are given
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted])

	console.log(globalState)
	return <PhaserDiv id="ccp-overlay" />
}

export default PhaserGame
