// SOCKET IO
export const SOCKET_URL = 'http://localhost:5000'

// SOCKET IO EVENTS
export const CROWD_IDLE = 'crowdIdle'
export const CROWD_CROUCH = 'crowdCrouch'
export const CROWD_RUN = 'crowdRun'
export const CROWD_SHOW = 'crowdShow'
export const CROWD_HIDE = 'crowdHide'
export const CROWD_MODE_UPDATE = 'crowdModeUpdate'

export const CROWD_CROUCH_AUDIO_VALUE_THRESHOLD = 50
export const CROWD_RUN_AUDIO_VALUE_THRESHOLD = 150

export enum CrowdMode {
	auto = 'auto',
	manual = 'manual',
}
export interface CrowdModeUpdate {
	mode: CrowdMode
}

export const MODERATOR_SHOW = 'moderatorShow'
export const MODERATOR_HIDE = 'moderatorHide'
export const MODERATOR_MESSAGE_UPDATE = 'moderatorMessageUpdate'

export interface ModeratorMessage {
	message: string
}

export const HOT_AIR_BALLON_SHOW = 'hodeAirBalloonShow'
export const HOT_AIR_BALLON_HIDE = 'hodeAirBalloonHide'
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

export const STATE_UPDATE = 'stateUpdate'
export const CROWD_UPDATE = 'crowdUpdate'
export const MODERATOR_UPDATE = 'moderatorUpdate'
export const BALLON_UPDATE = 'ballonUpdate'

export interface ICrowdState {
	mode: CrowdMode
	intensity: number
	visibility: boolean
}

export interface IModeratorState {
	message: string
	visibility: boolean
}

export interface IBallonState {
	visibility: boolean
}

export interface IState {
	crowd: ICrowdState
	moderator: IModeratorState
	ballon: IBallonState
}
