import Phaser from 'phaser'
import { gameConfig, SCENES } from './config'

export default class Game extends Phaser.Game {
	constructor() {
		super(gameConfig)
		this.scene.start(SCENES.OVERLAY)
	}
}
