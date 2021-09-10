import Phaser from 'phaser'
import { BubblesState, EmotesState } from '@ccp/common/shared'
import { getRandomInt } from '../../../util/utils'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

const BUBBLE_HEIGHT = 75

const BUBBLE_POS_X = 500
const BUBBLE_POS_Y = 800
export const SPEECH_BUBBLE_MEDIUM_KEY = 'speechBubbleMedium'

export class EmoteBubble extends Phaser.GameObjects.Graphics {
	public bubble: Phaser.GameObjects.Image
	public text: Phaser.GameObjects.Text

	constructor(
		scene: Phaser.Scene,
		senderName: string,
		state: EmotesState,
		emoteUrls: string[],
		options: CCPGameObjectProps
	) {
		super(scene)
		const startDelay = getRandomInt(0, 500)

		this.bubble = this.createSpeechBubble(scene)
		this.text = this.createBubbleText(scene, senderName, emoteUrls, startDelay)

		this.setName('emoteBubble')
		this.text.setAlpha(0)
		this.bubble.setAlpha(0)
		this.setAlpha(0)

		this.scene.tweens.add({
			targets: this.text,
			props: {
				alpha: 1,
			},
			duration: 500,
			delay: startDelay,
		})

		this.scene.tweens.add({
			targets: this.bubble,
			props: {
				alpha: 1,
			},
			duration: 500,
			delay: startDelay,
		})

		this.scene.tweens.add({
			targets: this.bubble,
			props: {
				alpha: 0,
			},
			delay: startDelay + 2500,
			duration: 500,
			onComplete: () => {
				this.destroy()
			},
		})
		this.scene.tweens.add({
			targets: this.text,
			props: {
				alpha: 0,
			},
			delay: startDelay + 2500,
			duration: 500,
			onComplete: () => {
				this.destroy()
			},
		})

		options.layer.add(this)

		this.setDepth(-1)

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: BubblesState) {
		this.setIsVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		this.bubble.setVisible(visible)
		this.text.setVisible(visible)
	}

	/**
	 * Inspired by https://phaser.io/examples/v3/view/game-objects/text/speech-bubble
	 */
	private createSpeechBubble(scene: Phaser.Scene) {
		const bubble = new Phaser.GameObjects.Image(scene, BUBBLE_POS_X, BUBBLE_POS_Y, SPEECH_BUBBLE_MEDIUM_KEY)
		this.scene.add.existing(bubble)
		return bubble
	}

	private createBubbleText(scene: Phaser.Scene, senderName: string, texture: string[], startDelay: number) {
		const content = scene.add.text(
			BUBBLE_POS_X - this.bubble.width / 2 + 5,
			BUBBLE_POS_Y - this.bubble.height / 2 - 33,
			senderName,
			{
				fontFamily: 'Roboto',
				fontSize: '20px',
				color: '#FFFFFF',
				padding: { left: 4, bottom: 4, right: 4, top: 4 },
				backgroundColor: '#000000',
			}
		)

		const spaceBetween = 35
		for (let i = 0; i <= texture.length && i < 3; i++) {
			const POS_X = i !== 0 ? this.bubble.x - 100 + i * 65 + spaceBetween : this.bubble.x + spaceBetween - 100
			const imageGraphic = new Phaser.GameObjects.Image(
				this.scene,
				POS_X,
				this.bubble.y - BUBBLE_HEIGHT / 2 + 20,
				texture[i]
			)
			imageGraphic.setAlpha(0)

			this.scene.tweens.add({
				targets: imageGraphic,
				props: {
					alpha: 1,
				},
				duration: 500,
				delay: startDelay + 500,
			})

			this.scene.tweens.add({
				targets: imageGraphic,
				props: {
					alpha: 0,
				},
				delay: startDelay + 2500,
				duration: 500,
				onComplete: () => {
					imageGraphic.destroy()
				},
			})
			imageGraphic.width = 50
			imageGraphic.height = 50
			scene.add.existing(imageGraphic)
		}
		return content
	}
}
