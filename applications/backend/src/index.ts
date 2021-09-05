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
	GlobalState,
	STATE_UPDATE,
	CrowdMode,
	REQUEST_STATE,
	EmotesState,
	BubblesState,
	BUBBLES_UPDATE,
	EMOTES_UPDATE,
	CCPSocketEventsMap,
	NEW_EMOTES_TRIGGER,
} from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'
import TwitchChatHandler from './TwitchChatHandler'

const httpServer = createServer()
const io = new Server<CCPSocketEventsMap>(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CROWD_UPDATE, (crowdUpdate: Partial<CrowdState>) => updateAndEmit(updateCrowd, crowdUpdate))
	socket.on(AUDIO_INPUT_VALUE_UPDATE, (data: AudioInputValue) => {
		logger.debug(`received AUDIO_INPUT_VALUE_UPDATE ${data.averageFrequencyPower}`)

		if (state.crowd.mode === CrowdMode.manual) {
			logger.debug(`declined AUDIO_INPUT_VALUE_UPDATE caused by state.crowd.mode set to: '${CrowdMode.manual}'.`)
			return
		}

		const crowdStateUpdate: Partial<CrowdState> = {
			intensity: data.averageFrequencyPower,
		}
		updateAndEmit(updateCrowd, crowdStateUpdate)
	})
	socket.on(MODERATOR_UPDATE, (moderatorUpdate: Partial<ModeratorState>) =>
		updateAndEmit(updateModerator, moderatorUpdate)
	)
	socket.on(HOT_AIR_BALLON_UPDATE, (hotAirBallonUpdate: Partial<HotAirBallonState>) =>
		updateAndEmit(updateHotAirBallon, hotAirBallonUpdate)
	)
	socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
		logger.info(`received HOT_AIR_BALLON_START`)
		io.emit(HOT_AIR_BALLON_START, data)
	})
	socket.on(EMOTES_UPDATE, (emotesUpdate: Partial<EmotesState>) => updateAndEmit(updateEmotes, emotesUpdate))
	socket.on(BUBBLES_UPDATE, (bubblesUpdate: Partial<BubblesState>) => updateAndEmit(updateBubbles, bubblesUpdate))
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})

	socket.emit(STATE_UPDATE, state)

	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, state))
})

const port = process.env.PORT_BACKEND ?? 5000
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

const twitchChatHandler = new TwitchChatHandler()
twitchChatHandler.on(NEW_EMOTES_TRIGGER, (emotes) => {
	logger.info(JSON.stringify(emotes))
	const emoteState: EmotesState = {
		...state.emotes,
		emoteUrls: emotes,
	}
	io.emit(NEW_EMOTES_TRIGGER, emoteState)
})

let state: GlobalState = {
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
	emotes: {
		visibility: false,
		emoteUrls: [],
	},
	bubbles: {
		visibility: false,
	},
}

const updateCrowd = (state: GlobalState, crowdUpdate: Partial<CrowdState>): GlobalState => {
	return {
		...state,
		crowd: {
			...state.crowd,
			...crowdUpdate,
		},
	}
}

const updateModerator = (state: GlobalState, moderatorUpdate: Partial<ModeratorState>): GlobalState => {
	return {
		...state,
		moderator: {
			...state.moderator,
			...moderatorUpdate,
		},
	}
}

const updateHotAirBallon = (state: GlobalState, hotAirBallonUpdate: Partial<HotAirBallonState>): GlobalState => {
	return {
		...state,
		hotAirballon: {
			...state.hotAirballon,
			...hotAirBallonUpdate,
		},
	}
}

const updateEmotes = (state: GlobalState, emotesUpdate: Partial<EmotesState>): GlobalState => {
	return {
		...state,
		emotes: {
			...state.emotes,
			...emotesUpdate,
		},
	}
}

const updateBubbles = (state: GlobalState, bubblesUpdate: Partial<BubblesState>): GlobalState => {
	return {
		...state,
		bubbles: {
			...state.bubbles,
			...bubblesUpdate,
		},
	}
}

const updateAndEmit = <T>(fn: (state: GlobalState, update: T) => GlobalState, update: T) => {
	state = fn(state, update)
	io.emit(STATE_UPDATE, state)
}
