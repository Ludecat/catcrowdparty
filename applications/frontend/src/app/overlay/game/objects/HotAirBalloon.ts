import Phaser from 'phaser'
import { HotAirBalloonVariation, HotAirBalloonVariationsType, HotAirBalloonState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

type DIRECTION_TYPE = 'goLeft' | 'goRight'
interface HotAirBalloonProps extends CCPGameObjectProps {
	variation: HotAirBalloonVariationsType
	direction: DIRECTION_TYPE
}

export const PARTICLE_KEY = 'particle'
export const HOT_AIR_BALLOON_STATE_KEY = {
	IDLE: 'idle',
}

export class HotAirBalloon extends Phaser.GameObjects.Sprite {
	private velocity = 200
	private variation: HotAirBalloonVariationsType
	private startX
	private startY
	private direction: DIRECTION_TYPE

	constructor(scene: Phaser.Scene, initialState: HotAirBalloonState, options: HotAirBalloonProps) {
		super(scene, options.x, options.y, options.variation)
		this.setName('hotAirBalloon')
		this.variation = options.variation
		this.direction = options.direction
		this.startX = options.x
		this.startY = options.y

		if (options.direction === 'goLeft') {
			this.flipX = true
		}

		this.anims.create({
			key: HOT_AIR_BALLOON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(options.variation, {
				start: 0,
				end: 7,
			}),
			frameRate: 12,
		})

		this.setScale(0.8)
		this.handleState(initialState)
		scene.physics.add.existing(this)
		options.layer.add(this)
		scene.add.existing(this)

		const particles = this.scene.add.particles(PARTICLE_KEY)
		const particleEmitter = particles.createEmitter({
			speed: 100,
			quantity: 0.2,
			gravityX: 0,
			gravityY: 200,
			scale: { start: 0.05, end: 0.3 },
		})
		particleEmitter.startFollow(this, this.direction === 'goLeft' ? 50 : -50, 140)
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === HOT_AIR_BALLOON_STATE_KEY.IDLE) return
		this.play({ key: HOT_AIR_BALLOON_STATE_KEY.IDLE, repeat: -1 })
	}

	public handleTrigger(data: HotAirBalloonVariation) {
		if (data.variation === this.variation) {
			if (this.direction === 'goLeft') {
				this.reset(this.scene.game.canvas.width + 100, this.startY)
				this.body.velocity.x = this.velocity * -1
			} else {
				this.reset(this.startX, this.startY)
				this.body.velocity.x = this.velocity
			}
		}
	}

	public handleState(state: HotAirBalloonState) {
		this.idle()
		this.setIsVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}

	private reset(x: number, y: number) {
		this.body.velocity.x = 0
		this.x = x
		this.y = y
	}
}
