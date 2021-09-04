import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	CCPSocketEventsMap,
	GlobalState,
	HotAirBallonVationsValues,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_START,
	REQUEST_STATE,
	STATE_UPDATE,
} from '@ccp/common/shared'
import { SCENES } from '../config'
import { Dude, DUDE_SPRITESHEET_KEY } from '../objects/Dude'
import { HotAirBalloon } from '../objects/HotAirBalloon'
import { Moderator, MODERATOR_SPRITESHEET_KEY } from '../objects/Moderator'

export class OverlayScene extends Phaser.Scene {
	public crowd: Dude[] = []
	public moderator: Moderator | null = null
	public hotAirBalloons: HotAirBalloon[] = []

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
		})

		config.socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
			for (const hotAirBalloon of this.hotAirBalloons) {
				hotAirBalloon.handleTrigger(data)
			}
		})
		console.log(`${SCENES.OVERLAY}: init()`)
	}

	preload() {
		/**
		 * Placeholder SpriteSheet
		 * https://rvros.itch.io/animated-pixel-hero
		 * https://glusoft.com/tutorials/sdl2/sprite-animations
		 */
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
		console.log(`${SCENES.OVERLAY}: preload()`)
	}

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config

		for (let i = 0; i < 23; i++) {
			this.crowd.push(new Dude(this, initialState.crowd, { x: i * 75, y: 1000 }))
		}

		this.moderator = new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width - 130,
			y: this.game.canvas.height - 200,
		})

		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'ludecat' })
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'fritz-cola' })
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, { x: -100, y: 400, variation: 'fh-salzburg' })
		)

		console.log(`${SCENES.OVERLAY}: create()`)
		socket.emit(REQUEST_STATE)
	}
}
