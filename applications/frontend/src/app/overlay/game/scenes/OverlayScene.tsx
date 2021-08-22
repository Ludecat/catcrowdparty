import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../config'
import { Dude, DUDE_SPRITESHEET_KEY } from '../objects/Dude'

export default class OverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init() {
		console.log(`${SCENES.OVERLAY}: init()`)
	}

	preload() {
		this.load.spritesheet(DUDE_SPRITESHEET_KEY, '/dude.png', {
			frameWidth: 77.42857142857143,
			frameHeight: 57.2727272727,
		})
		console.log(`${SCENES.OVERLAY}: preload()`)
	}

	create(socket: Socket) {
		/**
		 * Placeholder
		 */
		for (let i = 0; i < 26; i++) {
			new Dude(this, socket, { x: i * 75, y: 1000 })
		}
		console.log(`${SCENES.OVERLAY}: create()`)
	}
	update() {}
}
