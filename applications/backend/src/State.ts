import { BubblesState, CrowdMode, CrowdState, EmotesState, HotAirBallonState, ModeratorState } from '@ccp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
	name: 'emotes',
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

export const crowdReducer = crowdSlice.reducer
export const moderatorReducer = moderatorSlice.reducer
export const hotAirBallonReducer = hotAirBallonSlice.reducer
export const bubblesReducer = bubblesSlice.reducer
export const emotesReducer = emotesSlice.reducer

export const updateCrowd = crowdSlice.actions.update
export const updateModerator = moderatorSlice.actions.update
export const updateHotAirBallon = hotAirBallonSlice.actions.update
export const updateBubbles = bubblesSlice.actions.update
export const updateEmotes = emotesSlice.actions.update