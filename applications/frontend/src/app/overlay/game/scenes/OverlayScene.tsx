import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
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

	create(socket: Socket) {
		new Checkpoint(this, socket, { x: 50, y: 50 })
		new Checkpoint(this, socket, { x: 150, y: 150 })
		console.log(`${SCENES.OVERLAY}: create()`)
	}
	update() {}
}
