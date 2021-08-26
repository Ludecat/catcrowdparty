import { createServer } from 'http'
import {
	CROWD_CROUCH,
	CROWD_HIDE,
	CROWD_IDLE,
	CROWD_RUN,
	CROWD_SHOW,
	HOT_AIR_BALLON_HIDE,
	HOT_AIR_BALLON_SHOW,
	ModeratorMessage,
	MODERATOR_HIDE,
	MODERATOR_MESSAGE_UPDATE,
	MODERATOR_SHOW,
} from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	/**
	 * CROWD
	 */
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

	socket.on(CROWD_SHOW, () => {
		logger.info(`received CROWD_SHOW`)
		io.emit(CROWD_SHOW)
	})

	socket.on(CROWD_HIDE, () => {
		logger.info(`received CROWD_HIDE`)
		io.emit(CROWD_HIDE)
	})

	/**
	 * MODERATOR
	 */
	socket.on(MODERATOR_SHOW, (data: ModeratorMessage) => {
		logger.info(`received MODERATOR_SHOW`)
		io.emit(MODERATOR_SHOW, data)
	})

	socket.on(MODERATOR_MESSAGE_UPDATE, (data: ModeratorMessage) => {
		logger.info(`received MODERATOR_MESSAGE_UPDATE`)
		io.emit(MODERATOR_MESSAGE_UPDATE, data)
	})

	socket.on(MODERATOR_HIDE, () => {
		logger.info(`received MODERATOR_HIDE`)
		io.emit(MODERATOR_HIDE)
	})

	/**
	 * HOT AIR BALLOON
	 */
	socket.on(HOT_AIR_BALLON_SHOW, () => {
		logger.info(`received HOT_AIR_BALLON_SHOW`)
		io.emit(HOT_AIR_BALLON_SHOW)
	})

	socket.on(HOT_AIR_BALLON_HIDE, () => {
		logger.info(`received HOT_AIR_BALLON_HIDE`)
		io.emit(HOT_AIR_BALLON_HIDE)
	})

	/**
	 * DISCONNECT
	 */
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})
})

httpServer.listen(5000)
