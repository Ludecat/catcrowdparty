import Phaser from 'phaser'
import { SCENES } from '../config'

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
		console.log(`${SCENES.OVERLAY}: create()`)
	}
	update() {}
}
