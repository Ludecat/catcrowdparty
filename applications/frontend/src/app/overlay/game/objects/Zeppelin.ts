import Phaser from 'phaser'
import { ZeppelinVariationType, ZeppelinState, ZeppelinVariation } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

type DIRECTION_TYPE = 'goLeft' | 'goRight'
interface ZeppelinProps extends CCPGameObjectProps {
	variation: ZeppelinVariationType
	direction: DIRECTION_TYPE
}

export const ZEPPELIN_STATE_KEY = {
	IDLE: 'idle',
}

export class Zeppelin extends Phaser.GameObjects.Sprite {
	private velocity = 200
	private variation: ZeppelinVariationType
	private startX
	private startY
	private direction: DIRECTION_TYPE

	constructor(scene: Phaser.Scene, initialState: ZeppelinState, options: ZeppelinProps) {
		super(scene, options.x, options.y, options.variation)
		this.setName('zeppelin')
		this.variation = options.variation
		this.direction = options.direction
		this.startX = options.x
		this.startY = options.y

		if (options.direction === 'goRight') {
			this.anims.create({
				key: ZEPPELIN_STATE_KEY.IDLE,
				frames: this.anims.generateFrameNumbers(options.variation, {
					start: 4,
					end: 7,
				}),
				frameRate: 4,
			})
		} else {
			this.anims.create({
				key: ZEPPELIN_STATE_KEY.IDLE,
				frames: this.anims.generateFrameNumbers(options.variation, {
					start: 0,
					end: 3,
				}),
				frameRate: 4,
			})
		}

		this.setScale(1.42)
		this.handleState(initialState)
		scene.physics.add.existing(this)
		options.layer.add(this)
		scene.add.existing(this)
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === ZEPPELIN_STATE_KEY.IDLE) return
		this.play({ key: ZEPPELIN_STATE_KEY.IDLE, repeat: -1 })
	}

	public handleTrigger(data: ZeppelinVariation) {
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

	public handleState(state: ZeppelinState) {
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
