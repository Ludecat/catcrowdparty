import {
	BubblesState,
	CrowdMode,
	CrowdState,
	EmotesState,
	SettingsState,
	HotAirBalloonState,
	ModeratorState,
	ZeppelinState,
} from '@ccp/common'
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
	visibility: true,
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

const initialHotAirBalloonState: HotAirBalloonState = {
	visibility: true,
}

const hotAirBalloonSlice = createSlice({
	name: 'hotAirBalloon',
	initialState: initialHotAirBalloonState,
	reducers: {
		update: (state, action: PayloadAction<Partial<HotAirBalloonState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialBubblesState: BubblesState = {
	visibility: true,
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
	visibility: true,
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

const initialSettingsState: SettingsState = {
	crowdThreshold: [50, 150],
	twitchChannel: null,
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState: initialSettingsState,
	reducers: {
		update: (state, action: PayloadAction<Partial<SettingsState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialZeppelinState: ZeppelinState = {
	visibility: true,
}

const zeppelinSlice = createSlice({
	name: 'zeppelin',
	initialState: initialZeppelinState,
	reducers: {
		update: (state, action: PayloadAction<Partial<ZeppelinState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

export const settingsReducer = settingsSlice.reducer
export const zeppelinReducer = zeppelinSlice.reducer
export const crowdReducer = crowdSlice.reducer
export const moderatorReducer = moderatorSlice.reducer
export const hotAirBalloonReducer = hotAirBalloonSlice.reducer
export const bubblesReducer = bubblesSlice.reducer
export const emotesReducer = emotesSlice.reducer

export const updateSettings = settingsSlice.actions.update
export const updateZeppelin = zeppelinSlice.actions.update
export const updateCrowd = crowdSlice.actions.update
export const updateModerator = moderatorSlice.actions.update
export const updateHotAirBalloon = hotAirBalloonSlice.actions.update
export const updateBubbles = bubblesSlice.actions.update
export const updateEmotes = emotesSlice.actions.update
