import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	HotAirBalloonVariation,
	HotAirBalloonVariations,
	HOT_AIR_BALLON_START,
	State,
	STATE_UPDATE,
} from '@ccp/common/shared'

interface HotAirBallonProps {
	x: number
	y: number
	variation: HotAirBalloonVariations
}

export const HOT_AIR_BALLOON_STATE_KEY = {
	IDLE: 'idle',
}

export class HotAirBalloon extends Phaser.GameObjects.Sprite {
	public socket: Socket
	private velocity = 200

	constructor(scene: Phaser.Scene, socket: Socket, options: HotAirBallonProps) {
		super(scene, options.x, options.y, options.variation)

		this.anims.create({
			key: HOT_AIR_BALLOON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(options.variation, {
				start: 0,
				end: 4,
			}),
			frameRate: 12,
		})

		this.setScale(3)

		/**
		 * Suggestion:
		 * Get initial state from backend
		 */
		this.play({ key: HOT_AIR_BALLOON_STATE_KEY.IDLE, repeat: -1 })

		scene.physics.add.existing(this)
		scene.add.existing(this)

		socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
			console.log(`received HOT_AIR_BALLON_START: ${data.variation}`)
			if (data.variation === options.variation) {
				this.reset(options.x, options.y)
				this.body.velocity.x = this.velocity
			}
		})

		socket.on(STATE_UPDATE, (state: State) => {
			this.setVisible(state.hotAirballon.visibility)
		})

		this.socket = socket
	}

	private reset(x: number, y: number) {
		this.body.velocity.x = 0
		this.x = x
		this.y = y
	}
}
