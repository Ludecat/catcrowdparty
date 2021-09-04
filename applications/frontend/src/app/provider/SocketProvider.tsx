import React, { useEffect } from 'react'
import { createContext, FunctionComponent, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { CCPSocketEventsMap, SOCKET_URL } from '@ccp/common/shared'

export interface SockerContextState {
	socket: Socket<CCPSocketEventsMap> | null
}

const socketDefaultValue: SockerContextState = {
	socket: null,
}

export const SocketContext = createContext<SockerContextState>(socketDefaultValue)
export const SocketProvider: FunctionComponent = ({ children }) => {
	const [socket, setSocket] = useState<Socket<CCPSocketEventsMap> | null>(socketDefaultValue.socket)

	useEffect(() => {
		setSocket(io(SOCKET_URL, { transports: ['websocket', 'polling'] }))
	}, [])

	return (
		<SocketContext.Provider
			value={{
				socket,
			}}
		>
			{children}
		</SocketContext.Provider>
	)
}
