// SOCKET IO
export const SOCKET_URL = 'http://localhost:5000'

// SOCKET IO EVENTS
export const STATE_UPDATE = 'stateUpdate'
export const CROWD_UPDATE = 'crowdUpdate'
export const MODERATOR_UPDATE = 'moderatorUpdate'
export const BALLON_UPDATE = 'ballonUpdate'

export const CROWD_CROUCH_AUDIO_VALUE_THRESHOLD = 50
export const CROWD_RUN_AUDIO_VALUE_THRESHOLD = 150

export enum CrowdMode {
	auto = 'auto',
	manual = 'manual',
}
export interface CrowdModeUpdate {
	mode: CrowdMode
}

export const HOT_AIR_BALLON_START = 'hotAirBallonStart'

export interface HotAirBalloonVariation {
	variation: HotAirBalloonVariations
}

export type HotAirBalloonVariations = 'ludecat' | 'fritz-cola' | 'fh-salzburg'
export const HotAirBallonVationsValues = {
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

export interface BallonState {
	visibility: boolean
}

export interface State {
	crowd: CrowdState
	moderator: ModeratorState
	ballon: BallonState
}
