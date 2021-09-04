import { useEffect, useContext, useState } from 'react'
import { SocketContext } from '../provider/SocketProvider'

export const useSocket = () => {
	const { socket } = useContext(SocketContext)
	const [isConnected, setIsConnected] = useState(false)

	useEffect(() => {
		const cleanup = () => {
			if (socket) {
				socket.disconnect()
			}
		}
		socket?.on('connect', () => {
			setIsConnected(true)
		})
		if (socket) {
			return cleanup
		}
		return
	}, [socket])

	return { socket, isConnected }
}
