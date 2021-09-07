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
	GlobalState,
	STATE_UPDATE,
	CrowdMode,
	REQUEST_STATE,
	BUBBLES_UPDATE,
	EMOTES_UPDATE,
	CCPSocketEventsMap,
	NEW_EMOTES_TRIGGER,
	NEW_EMOTE_MESSAGE_TRIGGER,
} from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'
import { configureStore } from '@reduxjs/toolkit'
import {
	bubblesReducer,
	crowdReducer,
	emotesReducer,
	hotAirBallonReducer,
	moderatorReducer,
	updateBubbles,
	updateCrowd,
	updateEmotes,
	updateHotAirBallon,
	updateModerator,
} from './State'
import TwitchChatHandler, { NEW_EMOTES, NEW_EMOTE_MESSAGE } from './TwitchChatHandler'

const store = configureStore<GlobalState>({
	reducer: {
		crowd: crowdReducer,
		moderator: moderatorReducer,
		hotAirballon: hotAirBallonReducer,
		bubbles: bubblesReducer,
		emotes: emotesReducer,
	},
})

const httpServer = createServer()
const io = new Server<CCPSocketEventsMap>(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CROWD_UPDATE, (crowdUpdate) => store.dispatch(updateCrowd(crowdUpdate)))
	socket.on(AUDIO_INPUT_VALUE_UPDATE, (data: AudioInputValue) => {
		logger.debug(`received AUDIO_INPUT_VALUE_UPDATE ${data.averageFrequencyPower}`)

		if (store.getState().crowd.mode === CrowdMode.manual) {
			logger.debug(`declined AUDIO_INPUT_VALUE_UPDATE caused by state.crowd.mode set to: '${CrowdMode.manual}'.`)
			return
		}

		store.dispatch(
			updateCrowd({
				intensity: data.averageFrequencyPower,
			})
		)
	})
	socket.on(MODERATOR_UPDATE, (moderatorUpdate) => store.dispatch(updateModerator(moderatorUpdate)))
	socket.on(HOT_AIR_BALLON_UPDATE, (hotAirBallonUpdate) => store.dispatch(updateHotAirBallon(hotAirBallonUpdate)))
	socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
		logger.info(`received HOT_AIR_BALLON_START`)
		io.emit(HOT_AIR_BALLON_START, data)
	})
	socket.on(EMOTES_UPDATE, (emotesUpdate) => store.dispatch(updateEmotes(emotesUpdate)))
	socket.on(BUBBLES_UPDATE, (bubblesUpdate) => store.dispatch(updateBubbles(bubblesUpdate)))
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})

	socket.emit(STATE_UPDATE, store.getState())

	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, store.getState()))
})

store.subscribe(() => {
	io.emit(STATE_UPDATE, store.getState())
	console.log(store.getState())
})

const port = process.env.PORT_BACKEND ?? 5000
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

const twitchChatHandler = new TwitchChatHandler()

twitchChatHandler.on(NEW_EMOTES, (emoteUrls) => {
	logger.info(`newEmotes: ${JSON.stringify(emoteUrls)}`)

	const emoteState = store.getState().emotes
	if (emoteState.visibility) {
		io.emit(NEW_EMOTES_TRIGGER, emoteUrls, emoteState)
	}
})

twitchChatHandler.on(NEW_EMOTE_MESSAGE, (senderName, emoteUrls) => {
	logger.info(`newEmoteMessage from ${senderName}: ${JSON.stringify(emoteUrls)}`)

	const bubblesState = store.getState().bubbles
	if (bubblesState.visibility) {
		io.emit(NEW_EMOTE_MESSAGE_TRIGGER, senderName, emoteUrls, bubblesState)
	}
})
