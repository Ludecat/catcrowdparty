import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	CROWD_CROUCH_AUDIO_VALUE_THRESHOLD,
	CROWD_RUN_AUDIO_VALUE_THRESHOLD,
	State,
	STATE_UPDATE,
} from '@ccp/common/shared'

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
	public socket: Socket
	private currentAnimation = DUDE_STATE_KEY.IDLE

	constructor(scene: Phaser.Scene, socket: Socket, options: DudeProps) {
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

		/**
		 * Suggestion
		 * Get initial state from backend
		 */
		this.play({ key: DUDE_STATE_KEY.IDLE, repeat: -1 })

		socket.on(STATE_UPDATE, (state: State) => {
			let animation: string
			if (state.crowd.intensity >= CROWD_RUN_AUDIO_VALUE_THRESHOLD) {
				animation = DUDE_STATE_KEY.RUN
			} else if (state.crowd.intensity >= CROWD_CROUCH_AUDIO_VALUE_THRESHOLD) {
				animation = DUDE_STATE_KEY.CROUCH
			} else {
				animation = DUDE_STATE_KEY.IDLE
			}
			if (animation !== this.currentAnimation) {
				this.play({ key: animation, repeat: -1 })
				this.currentAnimation = animation
			}
			this.setVisible(state.crowd.visibility)
		})

		scene.add.existing(this)
		this.socket = socket
	}
}
