import { createServer } from 'http'
import { CROWD_CROUCH, CROWD_IDLE, CROWD_RUN } from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CROWD_IDLE, () => {
		logger.info(`received CROWD_IDLE`)
		io.emit(CROWD_IDLE)
	})

	socket.on(CROWD_CROUCH, () => {
		logger.info(`received CROWD_CROUCH`)
		io.emit(CROWD_CROUCH)
	})

	socket.on(CROWD_RUN, () => {
		logger.info(`received CROWD_RUN`)
		io.emit(CROWD_RUN)
	})

	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})
})

httpServer.listen(5000)
