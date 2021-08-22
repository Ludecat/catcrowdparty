import { createServer } from 'http'
import { SHARED } from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'

logger.info(`Hello World! ${SHARED}`)

const httpServer = createServer()
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)
})
httpServer.listen(5000)
