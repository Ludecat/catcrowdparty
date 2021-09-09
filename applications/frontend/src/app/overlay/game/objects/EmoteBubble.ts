import Phaser from 'phaser'
import { BubblesState, EmotesState } from '@ccp/common/shared'
import { getRandomInt } from '../../../util/utils'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const POS_Y = 500

const BUBBLE_WIDTH = 200
const BUBBLE_HEIGHT = 75

const BUBBLE_ARROW_WIDTH_THRESHOLD = 50
const BUBBLE_ARROW_HEIGHT = 100

export class EmoteBubble extends Phaser.GameObjects.Graphics {
	public bubble: Phaser.GameObjects.Graphics
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

		this.bubble = this.createSpeechBubble(scene, options.x, options.y, BUBBLE_WIDTH, BUBBLE_HEIGHT)
		this.text = this.createBubbleText(scene, senderName, emoteUrls, BUBBLE_WIDTH, BUBBLE_HEIGHT)

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

		/* this.scene.tweens.add({
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
		})*/

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
	private createSpeechBubble(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		const bubbleWidth = width
		const bubbleHeight = height
		const arrowHeight = bubbleHeight / 4
		const bubble = scene.add.graphics({ x: x, y: y })

		//  Bubble shadow
		bubble.fillStyle(0x222222, 0.5)
		bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16)

		//  Bubble color
		bubble.fillStyle(0xffffff, 1)

		//  Bubble outline line style
		bubble.lineStyle(4, 0x565656, 1)

		//  Bubble shape and outline
		bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)
		bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16)

		//  Calculate arrow coordinates
		const point1X = bubbleWidth - BUBBLE_ARROW_WIDTH_THRESHOLD
		const point1Y = bubbleHeight
		const point2X = bubbleWidth - BUBBLE_ARROW_HEIGHT
		const point2Y = bubbleHeight
		const point3X = Math.floor(bubbleWidth - BUBBLE_ARROW_HEIGHT)
		const point3Y = Math.floor(bubbleHeight + arrowHeight)

		//  Bubble arrow shadow
		bubble.lineStyle(4, 0x222222, 0.5)
		bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y)

		//  Bubble arrow fill
		bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y)
		bubble.lineStyle(2, 0x565656, 1)
		bubble.lineBetween(point2X, point2Y, point3X, point3Y)
		bubble.lineBetween(point1X, point1Y, point3X, point3Y)

		return bubble
	}

	private createBubbleText(
		scene: Phaser.Scene,
		senderName: string,
		texture: string[],
		bubbleWidth: number,
		bubbleHeight: number
	) {
		const bubblePadding = 10

		const content = scene.add.text(0, 0, senderName, {
			fontFamily: 'Roboto',
			fontSize: '20px',
			color: '#FFFFFF',
			align: 'center',
			wordWrap: { width: bubbleWidth - bubblePadding * 2 },
		})

		/**
		 * TODO:
		 * draw texture of emotes
		 */
		const b = content.getBounds()

		content.setPosition(this.bubble.x + 5, this.bubble.y - 23)
		return content
	}
}
