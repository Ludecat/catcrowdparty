import Phaser from 'phaser'
import { EmotesState } from '@ccp/common/shared'
import { getRandomInt } from '../../../util/utils'

export const EMOTE_SPRITESHEET_KEY = 'kappa'
export const POS_Y = 700

export class Emote extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, state: EmotesState, texture: string) {
		const POS_X = getRandomInt(100, scene.game.canvas.width - 100)
		super(scene, POS_X, POS_Y, texture)

		this.setName('emote')
		this.setScale(2)
		this.setAlpha(0)

		const startDelay = getRandomInt(0, 500)

		this.scene.tweens.add({
			targets: this,
			props: {
				x: {
					value: function () {
						return POS_X
					},
					ease: 'Power1',
				},
				y: {
					value: function () {
						return POS_Y - 200
					},
					ease: 'Power3',
				},
			},
			duration: 500,
			yoyo: true,
			repeat: 3,
			delay: startDelay,
		})

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 1,
			},
			duration: 500,
			delay: startDelay,
		})

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 0,
			},
			delay: startDelay + 2500,
			duration: 500,
			onComplete: () => {
				this.destroy()
			},
		})

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: EmotesState) {
		this.setVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
