import Phaser from 'phaser'
import OverlayScene from './scenes/OverlayScene'

export const gameConfig = {
	type: Phaser.AUTO,
	transparent: true,
	scale: {
		parent: 'ccp-overlay',
		width: 1920,
		height: 1080,
		autoCenter: Phaser.Scale.NONE,
	},
	physics: {
		default: 'matter',
		matter: {
			enabled: true,
			gravity: {},
			debug: true,
			showBody: true,
			showStaticBody: true,
			debugBodyColor: 0xff00ff,
		},
	},
	scene: [OverlayScene],
}

export const SCENES = {
	OVERLAY: 'OverlayScene',
}
