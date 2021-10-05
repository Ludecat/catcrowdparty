// SOCKET IO
export const SOCKET_URL = 'http://localhost:5000'

// SOCKET IO EVENTS
export const SETTINGS_UPDATE = 'settingsUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const CROWD_UPDATE = 'crowdUpdate'
export const MODERATOR_UPDATE = 'moderatorUpdate'
export const EMOTES_UPDATE = 'emotesUpdate'
export const BUBBLES_UPDATE = 'bubblesUpdate'
export const ZEPPELIN_UPDATE = 'zeppelinUpdate'
export const HOT_AIR_BALLOON_UPDATE = 'hotAirBalloonUpdate'

export const ZEPPELIN_START = 'zeppelinStart'
export const HOT_AIR_BALLOON_START = 'hotAirBalloonStart'

export const NEW_EMOTES_TRIGGER = 'newEmotes'
export const NEW_EMOTE_MESSAGE_TRIGGER = 'newEmoteMessage'

export const isIdleState = (intensity: number, threshold: number[]) => {
	return intensity < threshold[0]
}

export const isJumpState = (intensity: number, threshold: number[]) => {
	return intensity >= threshold[0] && intensity < threshold[1]
}

export const isPartyState = (intensity: number, threshold: number[]) => {
	return intensity >= threshold[1]
}

export enum CrowdMode {
	auto = 'auto',
	manual = 'manual',
}

export interface HotAirBalloonVariation {
	variation: HotAirBalloonVariationsType
}

export type HotAirBalloonVariationsType = 'ludecat' | 'fritz-cola' | 'fh-salzburg'
export const HotAirBalloonVationsValues = {
	ludecat: 'ludecat',
	fritzCola: 'fritz-cola',
	fhSalzburg: 'fh-salzburg',
}

export interface ZeppelinVariation {
	variation: ZeppelinVariationType
}
export type ZeppelinVariationType = 'akSalzburg' | 'fritzKola' | 'nerdic' | 'razer' | 'ubisoft' | 'willhaben'
export const ZeppelinVariationValues = {
	akSalzburg: 'akSalzburg',
	fritzKola: 'fritzKola',
	nerdic: 'nerdic',
	razer: 'razer',
	ubisoft: 'ubisoft',
	willhaben: 'willhaben',
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

export interface SettingsState {
	// crowdThreshold[0] = jumpState
	// crowdThreshold[1] =  partyState
	crowdThreshold: number[]
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

export interface ZeppelinState {
	visibility: boolean
}
export interface GlobalState {
	settings: SettingsState
	zeppelin: ZeppelinState
	crowd: CrowdState
	moderator: ModeratorState
	hotAirballoon: HotAirBalloonState
	emotes: EmotesState
	bubbles: BubblesState
}

export interface CCPSocketEventsMap {
	[SETTINGS_UPDATE]: (settingsUpdate: Partial<SettingsState>) => void
	[CROWD_UPDATE]: (crowdUpdate: Partial<CrowdState>) => void
	[MODERATOR_UPDATE]: (moderatorUpdate: Partial<ModeratorState>) => void
	[EMOTES_UPDATE]: (emotesUpdate: Partial<EmotesState>) => void
	[BUBBLES_UPDATE]: (bubblesUpdate: Partial<BubblesState>) => void
	[AUDIO_INPUT_VALUE_UPDATE]: (data: AudioInputValue) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[NEW_EMOTES_TRIGGER]: (emoteUrls: string[], emoteState: EmotesState) => void
	[NEW_EMOTE_MESSAGE_TRIGGER]: (senderName: string, color: string, emoteUrls: string[], emoteState: EmotesState) => void

	[ZEPPELIN_UPDATE]: (zeppelinUpdate: Partial<ZeppelinState>) => void
	[ZEPPELIN_START]: (data: ZeppelinVariation) => void

	[HOT_AIR_BALLOON_UPDATE]: (hotAirBalloonUpdate: Partial<HotAirBalloonState>) => void
	[HOT_AIR_BALLOON_START]: (data: HotAirBalloonVariation) => void
}
