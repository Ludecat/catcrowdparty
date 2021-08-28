// SOCKET IO
export const SOCKET_URL = 'http://localhost:5000'

// SOCKET IO EVENTS
export const CROWD_IDLE = 'crowdIdle'
export const CROWD_CROUCH = 'crowdCrouch'
export const CROWD_RUN = 'crowdRun'
export const CROWD_SHOW = 'crowdShow'
export const CROWD_HIDE = 'crowdHide'

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
