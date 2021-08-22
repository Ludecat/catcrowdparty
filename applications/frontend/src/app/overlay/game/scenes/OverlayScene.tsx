import Phaser from 'phaser'
import { SCENES } from '../config'
import { Checkpoint } from '../objects/Square'

export default class OverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init() {
		console.log(`${SCENES.OVERLAY}: init()`)
	}

	preload() {
		console.log(`${SCENES.OVERLAY}: preload()`)
	}

	create() {
		new Checkpoint(this, { x: 50, y: 50 })
		new Checkpoint(this, { x: 150, y: 150 })
		console.log(`${SCENES.OVERLAY}: create()`)
	}
	update() {}
}
