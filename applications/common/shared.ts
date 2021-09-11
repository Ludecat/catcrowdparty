// SOCKET IO
export const SOCKET_URL = 'http://localhost:5000'

// SOCKET IO EVENTS
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const CROWD_UPDATE = 'crowdUpdate'
export const MODERATOR_UPDATE = 'moderatorUpdate'
export const HOT_AIR_BALLOON_UPDATE = 'hotAirBalloonUpdate'
export const EMOTES_UPDATE = 'emotesUpdate'
export const BUBBLES_UPDATE = 'bubblesUpdate'

export const NEW_EMOTES_TRIGGER = 'newEmotes'
export const NEW_EMOTE_MESSAGE_TRIGGER = 'newEmoteMessage'

export const CROWD_CROUCH_AUDIO_VALUE_THRESHOLD = 50
export const CROWD_RUN_AUDIO_VALUE_THRESHOLD = 150

export enum CrowdMode {
	auto = 'auto',
	manual = 'manual',
}

export const HOT_AIR_BALLOON_START = 'hotAirBalloonStart'
export interface HotAirBalloonVariation {
	variation: HotAirBalloonVariationsType
}

export type HotAirBalloonVariationsType = 'ludecat' | 'fritz-cola' | 'fh-salzburg'
export const HotAirBalloonVationsValues = {
	ludecat: 'ludecat',
	fritzCola: 'fritz-cola',
	fhSalzburg: 'fh-salzburg',
}

export const AUDIO_INPUT_VALUE_UPDATE = 'audioInputValueUpdate'

export interface AudioInputValue {
	averageFrequencyPower: number
}

// State
export interface CrowdState {
	mode: CrowdMode
	intensity: number
	visibility: boolean
}

export interface ModeratorState {
	message: string
	visibility: boolean
}

export interface HotAirBalloonState {
	visibility: boolean
}

export interface EmotesState {
	visibility: boolean
}

export const EMOTE_MESSAGE = 'emoteMessage'
export interface BubblesState {
	visibility: boolean
}

export interface GlobalState {
	crowd: CrowdState
	moderator: ModeratorState
	hotAirballoon: HotAirBalloonState
	emotes: EmotesState
	bubbles: BubblesState
}

export interface CCPSocketEventsMap {
	[CROWD_UPDATE]: (crowdUpdate: Partial<CrowdState>) => void
	[MODERATOR_UPDATE]: (moderatorUpdate: Partial<ModeratorState>) => void
	[HOT_AIR_BALLOON_UPDATE]: (hotAirBalloonUpdate: Partial<HotAirBalloonState>) => void
	[EMOTES_UPDATE]: (emotesUpdate: Partial<EmotesState>) => void
	[BUBBLES_UPDATE]: (bubblesUpdate: Partial<BubblesState>) => void
	[AUDIO_INPUT_VALUE_UPDATE]: (data: AudioInputValue) => void
	[HOT_AIR_BALLOON_START]: (data: HotAirBalloonVariation) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[NEW_EMOTES_TRIGGER]: (emoteUrls: string[], emoteState: EmotesState) => void
	[NEW_EMOTE_MESSAGE_TRIGGER]: (senderName: string, emoteUrls: string[], emoteState: EmotesState) => void
}
