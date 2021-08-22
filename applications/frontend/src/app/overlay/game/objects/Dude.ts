import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { CROWD_CROUCH, CROWD_IDLE, CROWD_RUN } from '@ccp/common/shared'

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

		socket.on(CROWD_IDLE, () => {
			console.log('received CROWD_IDLE')
			this.play({ key: DUDE_STATE_KEY.IDLE, repeat: -1 })
		})
		socket.on(CROWD_CROUCH, () => {
			console.log('received CROWD_RUN')
			this.play({ key: DUDE_STATE_KEY.CROUCH, repeat: -1 })
		})
		socket.on(CROWD_RUN, () => {
			console.log('received CROWD_RUN')
			this.play({ key: DUDE_STATE_KEY.RUN, repeat: -1 })
		})

		scene.add.existing(this)
		this.socket = socket
	}
}
