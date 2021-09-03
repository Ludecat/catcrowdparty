import '@ccp/common/env'
import { createServer } from 'http'
import {
	MODERATOR_UPDATE,
	BALLON_UPDATE,
	AudioInputValue,
	AUDIO_INPUT_VALUE_UPDATE,
	CROWD_UPDATE,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_START,
	ModeratorState,
	BallonState,
	CrowdState,
	State,
	STATE_UPDATE,
	CrowdMode,
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
	socket.on(CROWD_UPDATE, (crowdUpdate: CrowdState) => updateAndEmit(updateCrowd, crowdUpdate))

	/**
	 * AUDIO CROWD STATE INPUT
	 */
	socket.on(AUDIO_INPUT_VALUE_UPDATE, (data: AudioInputValue) => {
		logger.info(`received AUDIO_INPUT_VALUE_UPDATE ${data.averageFrequencyPower}`)

		if (state.crowd.mode === CrowdMode.manual) {
			logger.info(`declined AUDIO_INPUT_VALUE_UPDATE caused by state.crowd.mode set to: '${CrowdMode.manual}'.`)
			return
		}

		const crowdStateUpdate: Partial<CrowdState> = {
			intensity: data.averageFrequencyPower,
		}
		updateAndEmit(updateCrowd, crowdStateUpdate)
	})

	/**
	 * MODERATOR
	 */
	socket.on(MODERATOR_UPDATE, (announcerUpdate: ModeratorState) => updateAndEmit(updateAnnouncer, announcerUpdate))

	/**
	 * HOT AIR BALLOON
	 */
	socket.on(BALLON_UPDATE, (ballonUpdate: BallonState) => updateAndEmit(updateBallon, ballonUpdate))

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

let state: State = {
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

const updateCrowd = (state: State, crowdUpdate: Partial<CrowdState>): State => {
	return {
		...state,
		crowd: {
			...state.crowd,
			...crowdUpdate,
		},
	}
}

const updateAnnouncer = (state: State, annoucerUpdate: Partial<ModeratorState>): State => {
	return {
		...state,
		moderator: {
			...state.moderator,
			...annoucerUpdate,
		},
	}
}

const updateBallon = (state: State, ballonUpdate: Partial<BallonState>): State => {
	return {
		...state,
		ballon: {
			...state.ballon,
			...ballonUpdate,
		},
	}
}

const updateAndEmit = <T>(fn: (state: State, update: T) => State, update: T) => {
	state = fn(state, update)
	io.emit(STATE_UPDATE, state)
}
