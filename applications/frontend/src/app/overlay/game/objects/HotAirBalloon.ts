import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { HOT_AIR_BALLON_HIDE, HOT_AIR_BALLON_SHOW } from '@ccp/common/shared'

interface ModeratorProps {
	x: number
	y: number
}

export const HOT_AIR_BALLOON_SPRITESHEET_KEY = 'hotAirBalloon'
export const HOT_AIR_BALLOON_STATE_KEY = {
	IDLE: 'idle',
}

export class HotAirBalloon extends Phaser.GameObjects.Sprite {
	public socket: Socket

	constructor(scene: Phaser.Scene, socket: Socket, options: ModeratorProps) {
		super(scene, options.x, options.y, HOT_AIR_BALLOON_SPRITESHEET_KEY)

		this.anims.create({
			key: HOT_AIR_BALLOON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(HOT_AIR_BALLOON_SPRITESHEET_KEY, {
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

		socket.on(HOT_AIR_BALLON_SHOW, () => {
			console.log('received HOT_AIR_BALLON_SHOW')
			this.setVisible(true)
		})
		socket.on(HOT_AIR_BALLON_HIDE, () => {
			console.log('received HOT_AIR_BALLON_HIDE')
			this.setVisible(false)
		})

		scene.add.existing(this)
		this.socket = socket
	}
}
