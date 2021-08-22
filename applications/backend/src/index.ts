import { createServer } from 'http'
import { DESTROY_CHECKBOXES, SHARED } from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'

logger.info(`Hello World! ${SHARED}`)

const httpServer = createServer()
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)
	setTimeout(() => {
		logger.info(`destroying..`)
		socket.emit(DESTROY_CHECKBOXES)
	}, 3000)

	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})
})

httpServer.listen(5000)
