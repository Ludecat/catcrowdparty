import { GlobalState } from '@ccp/common'
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { gameConfig, SCENES } from './config'

export class Game extends Phaser.Game {
	constructor(socket: Socket, height: number, width: number, initialState: GlobalState) {
		super({ ...gameConfig, scale: { ...gameConfig.scale, height, width } })
		this.scene.start(SCENES.OVERLAY, { socket, initialState })
	}
}
