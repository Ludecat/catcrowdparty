import Phaser from 'phaser'
import { BubblesState, EmotesState } from '@ccp/common/shared'
import { getRandomInt } from '../../../util/utils'
import { CCPGameObjectProps, CrowdPersonsWithBubble } from '../scenes/OverlayScene'
import { CrowdPerson } from './CrowdPerson'

const BUBBLE_HEIGHT = 75
export const SPEECH_BUBBLE_MEDIUM_RIGHT_KEY = 'speechBubbleRightMedium'
export const SPEECH_BUBBLE_MEDIUM_LEFT_KEY = 'speechBubbleLeftMedium'

interface EmoteBubbleProps extends CCPGameObjectProps {
	crowdPersonsWithBubble?: CrowdPersonsWithBubble
	crowdPerson?: CrowdPerson
	alignBubble?: 'left' | 'right'
}

export class EmoteBubble extends Phaser.GameObjects.Graphics {
	public bubble: Phaser.GameObjects.Image
	public text: Phaser.GameObjects.Text

	constructor(
		scene: Phaser.Scene,
		senderName: string,
		state: EmotesState,
		emoteUrls: string[],
		options: EmoteBubbleProps
	) {
		super(scene, { x: options.x, y: options.y })
		const startDelay = getRandomInt(0, 500)

		this.bubble = this.createSpeechBubble(scene, options.x, options.y, options.alignBubble)
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
				if (options.crowdPersonsWithBubble && options.crowdPerson) {
					options.crowdPersonsWithBubble[options.crowdPerson.texture.key] = options.crowdPerson
				}
				this.bubble.destroy()
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
				this.text.destroy()
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
	private createSpeechBubble(scene: Phaser.Scene, x: number, y: number, alignBubble?: 'left' | 'right') {
		const bubbleTexture = alignBubble === 'left' ? SPEECH_BUBBLE_MEDIUM_LEFT_KEY : SPEECH_BUBBLE_MEDIUM_RIGHT_KEY
		const newX = alignBubble === 'left' ? x + 105 : x
		const bubble = new Phaser.GameObjects.Image(scene, newX, y, bubbleTexture)
		this.scene.add.existing(bubble)
		return bubble
	}

	private createBubbleText(scene: Phaser.Scene, senderName: string, texture: string[], startDelay: number) {
		const content = scene.add.text(
			this.bubble.x - this.bubble.width / 2 + 5,
			this.bubble.y - this.bubble.height / 2 - 33,
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
