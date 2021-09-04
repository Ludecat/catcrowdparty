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
} from '@ccp/common'
import { logger } from './logger'
import { Server } from 'socket.io'
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

const httpServer = createServer()
const io = new Server<CCPSocketEventsMap>(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CROWD_UPDATE, (crowdUpdate) => store.dispatch(crowdSlice.actions.update(crowdUpdate)))
	socket.on(AUDIO_INPUT_VALUE_UPDATE, (data: AudioInputValue) => {
		logger.debug(`received AUDIO_INPUT_VALUE_UPDATE ${data.averageFrequencyPower}`)

		if (store.getState().crowd.mode === CrowdMode.manual) {
			logger.debug(`declined AUDIO_INPUT_VALUE_UPDATE caused by state.crowd.mode set to: '${CrowdMode.manual}'.`)
			return
		}

		const crowdStateUpdate: Partial<CrowdState> = {
			intensity: data.averageFrequencyPower,
		}
		store.dispatch(crowdSlice.actions.update(crowdStateUpdate))
	})
	socket.on(MODERATOR_UPDATE, (moderatorUpdate) => store.dispatch(moderatorSlice.actions.update(moderatorUpdate)))
	socket.on(HOT_AIR_BALLON_UPDATE, (hotAirBallonUpdate) =>
		store.dispatch(hotAirBallonSlice.actions.update(hotAirBallonUpdate))
	)
	socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
		logger.info(`received HOT_AIR_BALLON_START`)
		io.emit(HOT_AIR_BALLON_START, data)
	})
	socket.on(EMOTES_UPDATE, (emotesUpdate) => store.dispatch(emotesSlice.actions.update(emotesUpdate)))
	socket.on(BUBBLES_UPDATE, (bubblesUpdate) => store.dispatch(bubblesSlice.actions.update(bubblesUpdate)))
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})

	store.subscribe(() => {
		socket.emit(STATE_UPDATE, store.getState())
		console.log(store.getState())
	})

	socket.emit(STATE_UPDATE, store.getState())

	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, store.getState()))
})

const port = process.env.PORT_BACKEND ?? 5000
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

const initialModeratorState: ModeratorState = {
	message: '',
	visibility: false,
}

const moderatorSlice = createSlice({
	name: 'moderator',
	initialState: initialModeratorState,
	reducers: {
		update: (state, action: PayloadAction<Partial<ModeratorState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialCrowdState: CrowdState = {
	mode: CrowdMode.manual,
	intensity: 0,
	visibility: true,
}

const crowdSlice = createSlice({
	name: 'crowd',
	initialState: initialCrowdState,
	reducers: {
		update: (state, action: PayloadAction<Partial<CrowdState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialHotAirBallonState: HotAirBallonState = {
	visibility: false,
}

const hotAirBallonSlice = createSlice({
	name: 'hotAirBallon',
	initialState: initialHotAirBallonState,
	reducers: {
		update: (state, action: PayloadAction<Partial<HotAirBallonState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialBubblesState: BubblesState = {
	visibility: false,
}

const bubblesSlice = createSlice({
	name: 'bubbles',
	initialState: initialBubblesState,
	reducers: {
		update: (state, action: PayloadAction<Partial<BubblesState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialEmotesState: EmotesState = {
	visibility: false,
}

const emotesSlice = createSlice({
	name: 'bubbles',
	initialState: initialEmotesState,
	reducers: {
		update: (state, action: PayloadAction<Partial<EmotesState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const store = configureStore<GlobalState>({
	reducer: {
		moderator: moderatorSlice.reducer,
		crowd: crowdSlice.reducer,
		hotAirballon: hotAirBallonSlice.reducer,
		bubbles: bubblesSlice.reducer,
		emotes: emotesSlice.reducer,
	},
})
