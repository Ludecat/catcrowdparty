import { useRouter } from 'next/dist/client/router'
import { useEffect, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { SocketContext } from '../provider/SocketProvider'

export const useSocket = () => {
	const { socket } = useContext(SocketContext)
	const [isConnected, setIsConnected] = useState(false)
	const router = useRouter()

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

	useEffect(() => {
		socket?.on('disconnect', () => {
			if (router.pathname.includes('controlpanel')) {
				toast('Socket disconnected', { type: 'warning' })
			}
		})
		socket?.on('connect', () => {
			setIsConnected(true)
			if (router.pathname.includes('controlpanel')) {
				toast('Socket connected', { type: 'info' })
			}
		})
	}, [socket, router])

	return { socket, isConnected }
}
