import { STATE_UPDATE, GlobalState, REQUEST_STATE } from '@ccp/common'
import { useContext, useEffect } from 'react'
import { GlobalStateContext } from '../provider/GlobalStateProvider'
import { useSocket } from './useSocket'

export const useGlobalState = () => {
	const { globalState, setGlobalState } = useContext(GlobalStateContext)
	const { socket, isConnected } = useSocket()

	useEffect(() => {
		if (isConnected && socket) {
			socket.on(STATE_UPDATE, (state: GlobalState) => {
				setGlobalState(state)
			})
			socket.emit(REQUEST_STATE)
		}
	}, [socket, setGlobalState, isConnected])

	return { globalState }
}
