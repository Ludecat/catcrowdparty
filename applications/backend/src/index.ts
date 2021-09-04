import '@ccp/common/env'
import { createServer } from 'http'
import {
	MODERATOR_UPDATE,
	HOT_AIR_BALLON_UPDATE,
	AudioInputValue,
	AUDIO_INPUT_VALUE_UPDATE,
	CROWD_UPDATE,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_START,
	ModeratorState,
	HotAirBallonState,
	CrowdState,
	State,
	STATE_UPDATE,
	CrowdMode,
	REQUEST_STATE,
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
	socket.on(MODERATOR_UPDATE, (moderatorUpdate: ModeratorState) => updateAndEmit(updateModerator, moderatorUpdate))

	/**
	 * HOT AIR BALLOON
	 */
	socket.on(HOT_AIR_BALLON_UPDATE, (hotAirBallonUpdate: HotAirBallonState) => updateAndEmit(updateHotAirBallon, hotAirBallonUpdate))

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

	socket.emit(STATE_UPDATE, state)

	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, state))
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
	hotAirballon: {
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

const updateModerator = (state: State, moderatorUpdate: Partial<ModeratorState>): State => {
	return {
		...state,
		moderator: {
			...state.moderator,
			...moderatorUpdate,
		},
	}
}

const updateHotAirBallon = (state: State, hotAirBallonUpdate: Partial<HotAirBallonState>): State => {
	return {
		...state,
		hotAirballon: {
			...state.hotAirballon,
			...hotAirBallonUpdate,
		},
	}
}

const updateAndEmit = <T>(fn: (state: State, update: T) => State, update: T) => {
	state = fn(state, update)
	io.emit(STATE_UPDATE, state)
}
