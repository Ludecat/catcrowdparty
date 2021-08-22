import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { DESTROY_CHECKBOXES } from '@ccp/common/shared'

interface CharacterProps {
	x: number
	y: number
}

export class Checkpoint extends Phaser.GameObjects.Rectangle {
	public socket: Socket

	constructor(scene: Phaser.Scene, socket: Socket, options: CharacterProps) {
		super(scene, options.x, options.y, 60, 60, Phaser.Display.Color.HexStringToColor('#FF0000').color)
		scene.matter.add.gameObject(
			this,
			scene.matter.bodies.rectangle(options.x, options.y, 60, 60, {
				isStatic: true,
				label: 'a checkpoint',
			})
		)
		scene.add.existing(this)

		this.socket = socket
		this.socket.on(DESTROY_CHECKBOXES, () => {
			this.destroy()
		})
	}
}
