import Phaser from 'phaser'
import { ModeratorState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const MODERATOR_SPRITESHEET_KEY = 'moderator'
export const SPEECH_BUBBLE_SMALL_KEY = 'speechBubbleSmall'
export const MODERATOR_STATE_KEY = {
	IDLE: 'idle',
}

export class Moderator extends Phaser.GameObjects.Sprite {
	public bubble: Phaser.GameObjects.Image
	public text: Phaser.GameObjects.Text

	constructor(scene: Phaser.Scene, initialState: ModeratorState, options: CCPGameObjectProps) {
		super(scene, options.x, options.y, MODERATOR_SPRITESHEET_KEY)
		this.setName('moderator')

		this.anims.create({
			key: MODERATOR_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 0,
				end: 2,
			}),
			frameRate: 3,
		})

		this.bubble = this.createSpeechBubble(scene)
		this.text = this.createBubbleText(scene, initialState.message)

		this.setScale(2)
		this.handleState(initialState)
		options.layer.add(this)
		scene.add.existing(this)
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === MODERATOR_STATE_KEY.IDLE) return
		this.play({ key: MODERATOR_STATE_KEY.IDLE, repeat: -1 })
	}

	public handleState(state: ModeratorState) {
		this.idle()
		this.text.destroy()
		if (state.visibility) {
			this.text = this.createBubbleText(this.scene, state.message)
		}

		this.setIsVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
		this.bubble.setVisible(visible)
	}

	/**
	 * Inspired by https://phaser.io/examples/v3/view/game-objects/text/speech-bubble
	 */
	private createSpeechBubble(scene: Phaser.Scene) {
		const bubble = new Phaser.GameObjects.Image(
			scene,
			scene.game.canvas.width - 365,
			this.y - 190,
			SPEECH_BUBBLE_SMALL_KEY
		)
		bubble.setScale(2.25)
		this.scene.add.existing(bubble)
		return bubble
	}

	private createBubbleText(scene: Phaser.Scene, message: string) {
		const bubblePadding = 70

		const content = scene.add.text(0, 0, message, {
			fontFamily: 'Roboto',
			fontSize: '20px',
			color: '#000000',
			align: 'center',
			wordWrap: { width: this.bubble.width + bubblePadding },
		})

		const b = content.getBounds()

		content.setPosition(this.bubble.x - b.width / 2, this.bubble.y - b.height / 2 - 40)
		return content
	}
}
