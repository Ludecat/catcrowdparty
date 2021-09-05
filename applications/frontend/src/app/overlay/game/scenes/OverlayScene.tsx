import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	CCPSocketEventsMap,
	EmotesState,
	GlobalState,
	HotAirBallonVationsValues,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_START,
	NEW_EMOTES_TRIGGER,
	REQUEST_STATE,
	STATE_UPDATE,
} from '@ccp/common/shared'
import { SCENES } from '../config'
import { Dude, DUDE_SPRITESHEET_KEY } from '../objects/Dude'
import { HotAirBalloon } from '../objects/HotAirBalloon'
import { Moderator, MODERATOR_SPRITESHEET_KEY } from '../objects/Moderator'
import { Emote, EMOTE_SPRITESHEET_KEY } from '../objects/Emote'

export class OverlayScene extends Phaser.Scene {
	public crowd: Dude[] = []
	public moderator: Moderator | null = null
	public hotAirBalloons: HotAirBalloon[] = []
	public emotes: Emote[] = []

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		config.socket.on(STATE_UPDATE, (state: GlobalState) => {
			for (const dude of this.crowd) {
				dude.handleState(state.crowd)
			}

			this.moderator?.handleState(state.moderator)

			for (const hotAirBalloon of this.hotAirBalloons) {
				hotAirBalloon.handleState(state.hotAirballon)
			}

			for (const emotes of this.emotes) {
				emotes.handleState(state.emotes)
			}
		})

		config.socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
			for (const hotAirBalloon of this.hotAirBalloons) {
				hotAirBalloon.handleTrigger(data)
			}
		})

		config.socket.on(NEW_EMOTES_TRIGGER, (state: EmotesState) => {
			if (state.emoteUrls && state.visibility) {
				for (const newEmote of state.emoteUrls) {
					this.emotes.push(new Emote(this, state))
				}
			}
		})
	}

	preload() {
		/**
		 * Placeholder SpriteSheet
		 * https://rvros.itch.io/animated-pixel-hero
		 * https://glusoft.com/tutorials/sdl2/sprite-animations
		 */
		this.load.image(EMOTE_SPRITESHEET_KEY, '/kappa.png')
		this.load.spritesheet(DUDE_SPRITESHEET_KEY, '/dude.png', {
			frameWidth: 77.42857142857143,
			frameHeight: 57.2727272727,
		})
		this.load.spritesheet(MODERATOR_SPRITESHEET_KEY, '/dude.png', {
			frameWidth: 77.42857142857143,
			frameHeight: 57.2727272727,
		})
		this.load.spritesheet(HotAirBallonVationsValues.ludecat, '/hot_air_balloon_ludecat.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBallonVationsValues.fritzCola, '/hot_air_balloon_fritz_cola.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBallonVationsValues.fhSalzburg, '/hot_air_balloon_fh_salzburg.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
	}

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config

		for (let i = 0; i < 23; i++) {
			this.crowd.push(new Dude(this, initialState.crowd, { x: i * 75, y: 1000 }))
		}

		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'ludecat' })
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'fritz-cola' })
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'fh-salzburg' })
		)

		this.moderator = new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width - 130,
			y: this.game.canvas.height - 200,
		})

		socket.emit(REQUEST_STATE)
	}
}
