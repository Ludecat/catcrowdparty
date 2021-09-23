import Phaser from 'phaser'
import { EmotesState } from '@ccp/common/shared'
import { getRandomInt } from '../../../util/utils'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const POS_Y = 700

export class Emote extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, state: EmotesState, texture: string, options: CCPGameObjectProps) {
		super(scene, options.x, options.y, texture)

		this.setName('emote')
		this.width = 50
		this.height = 50
		this.setAlpha(0)

		const startDelay = getRandomInt(0, 500)

		this.scene.tweens.add({
			targets: this,
			props: {
				x: {
					value: function () {
						return options.x
					},
					ease: 'Power1',
				},
				y: {
					value: function () {
						return options.y - 200
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
		options.layer.add(this)
		this.setDepth(-10)
		scene.add.existing(this)
	}

	public handleState(state: EmotesState) {
		this.setIsVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
