import Phaser from 'phaser'

interface CharacterProps {
	x: number
	y: number
}

export class Checkpoint extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, options: CharacterProps) {
		super(scene, options.x, options.y, 60, 60, Phaser.Display.Color.HexStringToColor('#FF0000').color)
		scene.matter.add.gameObject(
			this,
			scene.matter.bodies.rectangle(options.x, options.y, 60, 60, {
				isStatic: true,
				label: 'a checkpoint',
			})
		)
		scene.add.existing(this)
	}
}
