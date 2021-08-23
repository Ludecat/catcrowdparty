import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { ModeratorMessage, MODERATOR_HIDE, MODERATOR_SHOW } from '@ccp/common/shared'

interface ModeratorProps {
	x: number
	y: number
}

export const MODERATOR_SPRITESHEET_KEY = 'moderator'
export const MODERATOR_STATE_KEY = {
	IDLE: 'idle',
}

export class Moderator extends Phaser.GameObjects.Sprite {
	public socket: Socket

	constructor(scene: Phaser.Scene, socket: Socket, options: ModeratorProps) {
		super(scene, options.x, options.y, MODERATOR_SPRITESHEET_KEY)

		this.anims.create({
			key: MODERATOR_STATE_KEY.IDLE, // jump
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 14,
				end: 17,
			}),
			frameRate: 6,
		})

		this.setScale(6)

		/**
		 * Suggestion
		 * Get initial state from backend
		 */
		this.play({ key: MODERATOR_STATE_KEY.IDLE, repeat: -1 })

		socket.on(MODERATOR_SHOW, (data: ModeratorMessage) => {
			console.log('received MODERATOR_SHOW')
			console.log(data.message)
			this.setVisible(true)
		})
		socket.on(MODERATOR_HIDE, () => {
			console.log('received MODERATOR_HIDE')
			this.setVisible(false)
		})

		scene.add.existing(this)
		this.socket = socket
	}
}
