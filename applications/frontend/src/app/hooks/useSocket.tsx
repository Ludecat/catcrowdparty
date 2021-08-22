import { useEffect, useContext } from 'react'
import { SocketContext } from '../provider/SocketProvider'

export const useSocket = () => {
	const { socket } = useContext(SocketContext)

	useEffect(() => {
		const cleanup = () => {
			if (socket) {
				socket.disconnect()
			}
		}
		if (socket) {
			return cleanup
		}
		return
	}, [socket])

	return { socket }
}
