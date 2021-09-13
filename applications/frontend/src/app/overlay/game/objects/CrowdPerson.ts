import Phaser from 'phaser'
import { CrowdState, CROWD_CROUCH_AUDIO_VALUE_THRESHOLD, CROWD_RUN_AUDIO_VALUE_THRESHOLD } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'
import { getRandomInt } from '../../../util/utils'

export const CROWD_PERSON_BLUE_KEY = 'crowdPersonBlue'
export const CROWD_PERSON_GREEN_KEY = 'crowdPersonGreen'
export const CROWD_PERSON_PINK_KEY = 'crowdPersonPink'

export const CROWD_PERSON_STATE_KEY = {
	IDLE: 'idle',
	JUMP: 'jump',
	PARTY: 'party',
}

export class CrowdPerson extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, crowdState: CrowdState, options: CCPGameObjectProps, texture: string) {
		super(scene, options.x, options.y, texture)
		this.setName('crowdperson')

		const startDelay = getRandomInt(0, 250)
		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 0,
				end: 1,
			}),
			frameRate: 3,
			delay: startDelay,
		})
		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.JUMP,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 2,
				end: 6,
			}),
			frameRate: 7,
			delay: startDelay,
		})
		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.PARTY,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 7,
				end: 11,
			}),
			frameRate: 7,
			delay: startDelay,
		})

		this.setScale(0.55)
		this.handleState(crowdState)
		options.layer.add(this)
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
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.PARTY) return
		this.play({ key: CROWD_PERSON_STATE_KEY.PARTY, repeat: -1 })
	}

	public crouch() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.JUMP) return
		this.play({ key: CROWD_PERSON_STATE_KEY.JUMP, repeat: -1 })
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.IDLE) return
		this.play({ key: CROWD_PERSON_STATE_KEY.IDLE, repeat: -1 })
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
