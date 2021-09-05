import Phaser from 'phaser'
import { EmotesState } from '@ccp/common/shared'

interface DudeProps {
	x: number
	y: number
}

export const EMOTE_SPRITESHEET_KEY = 'kappa'

export class Emote extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, emoteState: EmotesState, options: DudeProps) {
		super(scene, options.x, options.y, EMOTE_SPRITESHEET_KEY)

		this.setScale(2)
		this.setAlpha(0)

		const startDelay = this.getRandomInt(0, 500)
		this.handleState(emoteState)

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 1,
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
				alpha: 0,
			},
			delay: startDelay + 2500,
			duration: 500,
			onComplete: () => {
				this.destroy()
			},
		})

		scene.add.existing(this)
	}

	private getRandomInt(min: number, max: number) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min)) + min
	}

	public handleState(state: EmotesState) {
		this.setVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
