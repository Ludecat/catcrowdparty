import Phaser from 'phaser'
import { HotAirBalloonVariation, HotAirBalloonVariationsType, HotAirBallonState } from '@ccp/common/shared'

interface HotAirBallonProps {
	x: number
	y: number
	variation: HotAirBalloonVariationsType
}

export const HOT_AIR_BALLOON_STATE_KEY = {
	IDLE: 'idle',
}

export class HotAirBalloon extends Phaser.GameObjects.Sprite {
	private velocity = 200
	private variation: HotAirBalloonVariationsType
	private startX
	private startY

	constructor(scene: Phaser.Scene, initialState: HotAirBallonState, options: HotAirBallonProps) {
		super(scene, options.x, options.y, options.variation)
		this.variation = options.variation
		this.startX = options.x
		this.startY = options.y

		this.anims.create({
			key: HOT_AIR_BALLOON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(options.variation, {
				start: 0,
				end: 4,
			}),
			frameRate: 12,
		})

		this.setScale(3)
		this.setVisible(initialState.visibility)
		this.idle()
		scene.physics.add.existing(this)
		scene.add.existing(this)
	}

	public idle() {
		this.play({ key: HOT_AIR_BALLOON_STATE_KEY.IDLE, repeat: -1 })
	}

	public handleTrigger(data: HotAirBalloonVariation) {
		if (data.variation === this.variation) {
			this.reset(this.startX, this.startY)
			this.body.velocity.x = this.velocity
		}
	}

	public handleState(state: HotAirBallonState) {
		this.setVisible(state.visibility)
	}

	private reset(x: number, y: number) {
		this.body.velocity.x = 0
		this.x = x
		this.y = y
	}
}
