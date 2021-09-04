import Phaser from 'phaser'
import { CrowdState, CROWD_CROUCH_AUDIO_VALUE_THRESHOLD, CROWD_RUN_AUDIO_VALUE_THRESHOLD } from '@ccp/common/shared'

interface DudeProps {
	x: number
	y: number
}

export const DUDE_SPRITESHEET_KEY = 'dude'
export const DUDE_STATE_KEY = {
	IDLE: 'idle',
	CROUCH: 'crouch',
	RUN: 'run',
}

export class Dude extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, crowdState: CrowdState, options: DudeProps) {
		super(scene, options.x, options.y, DUDE_SPRITESHEET_KEY)

		this.anims.create({
			key: DUDE_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(DUDE_SPRITESHEET_KEY, {
				start: 0,
				end: 3,
			}),
			frameRate: 6,
		})
		this.anims.create({
			key: DUDE_STATE_KEY.CROUCH,
			frames: this.anims.generateFrameNumbers(DUDE_SPRITESHEET_KEY, {
				start: 4,
				end: 7,
			}),
			frameRate: 6,
		})
		this.anims.create({
			key: DUDE_STATE_KEY.RUN,
			frames: this.anims.generateFrameNumbers(DUDE_SPRITESHEET_KEY, {
				start: 8,
				end: 13,
			}),
			frameRate: 12,
		})

		this.setScale(2)
		this.handleState(crowdState)
		scene.add.existing(this)
	}

	public handleState(state: CrowdState) {
		if (state.intensity >= CROWD_RUN_AUDIO_VALUE_THRESHOLD) {
			this.run()
		} else if (state.intensity >= CROWD_CROUCH_AUDIO_VALUE_THRESHOLD) {
			this.crouch()
		} else {
			this.idle()
		}
		this.setVisible(state.visibility)
	}

	public run() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === DUDE_STATE_KEY.RUN) return
		this.play({ key: DUDE_STATE_KEY.RUN, repeat: -1 })
	}

	public crouch() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === DUDE_STATE_KEY.CROUCH) return
		this.play({ key: DUDE_STATE_KEY.CROUCH, repeat: -1 })
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === DUDE_STATE_KEY.IDLE) return
		this.play({ key: DUDE_STATE_KEY.IDLE, repeat: -1 })
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
