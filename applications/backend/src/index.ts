import '@ccp/common/env'
import { createServer } from 'http'
import {
	MODERATOR_UPDATE,
	BALLON_UPDATE,
	AudioInputValue,
	AUDIO_INPUT_VALUE_UPDATE,
	CROWD_CROUCH,
	CROWD_HIDE,
	CROWD_IDLE,
	CROWD_CROUCH_AUDIO_VALUE_THRESHOLD,
	CROWD_MODE_UPDATE,
	CROWD_RUN,
	CROWD_SHOW,
	CROWD_UPDATE,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_HIDE,
	HOT_AIR_BALLON_SHOW,
	HOT_AIR_BALLON_START,
	IModeratorState,
	IBallonState,
	ICrowdState,
	IState,
	ModeratorMessage,
	MODERATOR_HIDE,
	MODERATOR_MESSAGE_UPDATE,
	MODERATOR_SHOW,
	STATE_UPDATE,
	CROWD_RUN_AUDIO_VALUE_THRESHOLD,
	CrowdModeUpdate,
	CrowdMode,
} from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {})

let crowdControleMode: CrowdMode = CrowdMode.manual

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

	socket.on(CROWD_MODE_UPDATE, (data: CrowdModeUpdate) => {
		logger.info(`received CROWD_MODE_UPDATE: ${data.mode}`)
		crowdControleMode = data.mode
		io.emit(CROWD_MODE_UPDATE, data)
	})

	/**
	 * AUDIO CROWD STATE INPUT
	 */
	socket.on(AUDIO_INPUT_VALUE_UPDATE, (data: AudioInputValue) => {
		logger.info(`received AUDIO_INPUT_VALUE_UPDATE ${data.averageFrequencyPower}`)

		if (crowdControleMode === CrowdMode.manual) {
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			logger.info(`declined AUDIO_INPUT_VALUE_UPDATE caused by crowdControleMode set to: '${crowdControleMode}'.`)
			return
		}

		io.emit(AUDIO_INPUT_VALUE_UPDATE, data)

		if (data.averageFrequencyPower >= CROWD_RUN_AUDIO_VALUE_THRESHOLD) {
			io.emit(CROWD_RUN)
			return
		}
		if (data.averageFrequencyPower >= CROWD_CROUCH_AUDIO_VALUE_THRESHOLD) {
			io.emit(CROWD_CROUCH)
			return
		}
		io.emit(CROWD_IDLE)
	})

	/**
	 * MODERATOR
	 */
	socket.on(MODERATOR_SHOW, (data: ModeratorMessage) => {
		logger.info(`received MODERATOR_SHOW`)
		io.emit(MODERATOR_SHOW, data)
	})

	socket.on(MODERATOR_HIDE, () => {
		logger.info(`received MODERATOR_HIDE`)
		io.emit(MODERATOR_HIDE)
	})

	socket.on(MODERATOR_MESSAGE_UPDATE, (data: ModeratorMessage) => {
		logger.info(`received MODERATOR_MESSAGE_UPDATE`)
		io.emit(MODERATOR_MESSAGE_UPDATE, data)
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

	socket.on(CROWD_UPDATE, (crowdUpdate: ICrowdState) => updateAndEmit(updateCrowd, crowdUpdate))
	socket.on(MODERATOR_UPDATE, (announcerUpdate: IModeratorState) => updateAndEmit(updateAnnouncer, announcerUpdate))
	socket.on(BALLON_UPDATE, (ballonUpdate: IBallonState) => updateAndEmit(updateBallon, ballonUpdate))
})

const port = process.env.PORT_BACKEND ?? 5000
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

let state: IState = {
	crowd: {
		mode: CrowdMode.manual,
		intensity: 0,
		visibility: true,
	},
	moderator: {
		message: '',
		visibility: false,
	},
	ballon: {
		visibility: false,
	},
}

const updateCrowd = (state: IState, crowdUpdate: Partial<ICrowdState>): IState => {
	return {
		...state,
		crowd: {
			...state.crowd,
			...crowdUpdate,
		},
	}
}

const updateAnnouncer = (state: IState, annoucerUpdate: Partial<IModeratorState>): IState => {
	return {
		...state,
		moderator: {
			...state.moderator,
			...annoucerUpdate,
		},
	}
}

const updateBallon = (state: IState, ballonUpdate: Partial<IBallonState>): IState => {
	return {
		...state,
		ballon: {
			...state.ballon,
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
