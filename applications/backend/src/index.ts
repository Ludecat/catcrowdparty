import '@ccp/common/env'
import { createServer } from 'http'
import {
	ANNOUNCER_UPDATE,
	BALLON_UPDATE,
	CROWD_CROUCH,
	CROWD_HIDE,
	CROWD_IDLE,
	CROWD_RUN,
	CROWD_SHOW,
	CROWD_UPDATE,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_HIDE,
	HOT_AIR_BALLON_SHOW,
	HOT_AIR_BALLON_START,
	IAnnouncerState,
	IBallonState,
	ICrowdState,
	IState,
	ModeratorMessage,
	MODERATOR_HIDE,
	MODERATOR_MESSAGE_UPDATE,
	MODERATOR_SHOW,
	STATE_UPDATE,
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

	socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
		logger.info(`received HOT_AIR_BALLON_START`)
		io.emit(HOT_AIR_BALLON_START, data)
	})

	/**
	 * DISCONNECT
	 */
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})
})

const port = process.env.PORT_BACKEND ?? 5000
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

let state: IState = {
	crowd: {
		mode: 'manuell',
		intensity: 0,
		visibility: true,
	},
	announcer: {
		message: '',
		visibility: false,
	},
	ballon: {
		visibility: false,
	},
}

const updateCrowd = (state: IState, crowdUpdate: ICrowdState): IState => {
	return {
		...state,
		crowd: {
			...crowdUpdate,
		},
	}
}

const updateAnnouncer = (state: IState, annoucerUpdate: IAnnouncerState): IState => {
	return {
		...state,
		announcer: {
			...annoucerUpdate,
		},
	}
}

const updateBallon = (state: IState, ballonUpdate: IBallonState): IState => {
	return {
		...state,
		ballon: {
			...ballonUpdate,
		},
	}
}

// state = updateAnnouncer(state, {
// 	message: 'Hi there',
// 	visibility: true,
// })

// state = updateCrowd(state, {
// 	intensity: 30,
// 	mode: 'manual',
// 	visibility: true,
// })

// state = updateBallon(state, {
// 	visibility: false,
// })

const updateAndEmit = <T>(fn: (state: IState, update: T) => IState, update: T) => {
	state = fn(state, update)
	io.emit(STATE_UPDATE, state)
}

io.on(CROWD_UPDATE, (crowdUpdate: ICrowdState) => updateAndEmit(updateCrowd, crowdUpdate))
io.on(ANNOUNCER_UPDATE, (announcerUpdate: IAnnouncerState) => updateAndEmit(updateAnnouncer, announcerUpdate))
io.on(BALLON_UPDATE, (ballonUpdate: IBallonState) => updateAndEmit(updateBallon, ballonUpdate))
