import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { gameConfig, SCENES } from './config'

export default class Game extends Phaser.Game {
	constructor(socket: Socket, height: number, width: number) {
		super({ ...gameConfig, scale: { ...gameConfig.scale, height, width } })
		this.scene.start(SCENES.OVERLAY, socket)
	}
}
