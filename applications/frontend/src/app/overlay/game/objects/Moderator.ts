import Phaser from 'phaser'
import { ModeratorState } from '@ccp/common/shared'

interface ModeratorProps {
	x: number
	y: number
}

export const MODERATOR_SPRITESHEET_KEY = 'moderator'
export const MODERATOR_STATE_KEY = {
	IDLE: 'idle',
}

const BUBBLE_WIDTH = 300
const BUBBLE_HEIGHT = 200

export class Moderator extends Phaser.GameObjects.Sprite {
	public bubble: Phaser.GameObjects.Graphics
	public text: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene, initialState: ModeratorState, options: ModeratorProps) {
		super(scene, options.x, options.y, MODERATOR_SPRITESHEET_KEY)

		this.anims.create({
			key: MODERATOR_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 14,
				end: 17,
			}),
			frameRate: 6,
		})

		this.bubble = this.createSpeechBubble(scene, scene.game.canvas.width - 375, 510, BUBBLE_WIDTH, BUBBLE_HEIGHT)
		this.text = this.createBubbleText(scene, initialState.message, BUBBLE_WIDTH, BUBBLE_HEIGHT)

		this.setScale(6)
		this.idle()
		scene.add.existing(this)
	}

	public idle() {
		this.play({ key: MODERATOR_STATE_KEY.IDLE, repeat: -1 })
	}

	public handleState(state: ModeratorState) {
		this.text.destroy()
		if (state.visibility) {
			this.text = this.createBubbleText(this.scene, state.message, BUBBLE_WIDTH, BUBBLE_HEIGHT)
		}

		this.setVisible(state.visibility)
		this.bubble.setVisible(state.visibility)
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
		const point1X = bubbleWidth - 200
		const point1Y = bubbleHeight
		const point2X = bubbleWidth - 100
		const point2Y = bubbleHeight
		const point3X = Math.floor(bubbleWidth - 100)
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

	private createBubbleText(scene: Phaser.Scene, message: string, bubbleWidth: number, bubbleHeight: number) {
		const bubblePadding = 10

		const content = scene.add.text(0, 0, message, {
			fontFamily: 'Roboto',
			fontSize: '20px',
			color: '#000000',
			align: 'center',
			wordWrap: { width: bubbleWidth - bubblePadding * 2 },
		})

		const b = content.getBounds()

		content.setPosition(this.bubble.x + bubbleWidth / 2 - b.width / 2, this.bubble.y + bubbleHeight / 2 - b.height / 2)
		return content
	}
}
