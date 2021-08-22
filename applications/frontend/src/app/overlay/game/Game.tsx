import Phaser from 'phaser'
import { gameConfig, SCENES } from './config'

export default class Game extends Phaser.Game {
	constructor(height: number, width: number) {
		super({ ...gameConfig, scale: { ...gameConfig.scale, height, width } })
		this.scene.start(SCENES.OVERLAY)
	}
}
