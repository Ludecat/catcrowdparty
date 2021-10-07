import Phaser from 'phaser'
import { ModeratorState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const MODERATOR_SPRITESHEET_KEY = 'moderator'
export const SPEECH_BUBBLE_SMALL_RIGHT_KEY = 'speechBubbleRightSmall'
export const SPEECH_BUBBLE_SMALL_LEFT_KEY = 'speechBubbleLeftSmall'
export const MODERATOR_STATE_KEY = {
	IDLE: 'idle',
	WALK_LEFT: 'walkLeft',
	WALK_RIGHT: 'walkRight',
}

export class Moderator extends Phaser.GameObjects.Sprite {
	public bubble: Phaser.GameObjects.Image
	public text: Phaser.GameObjects.Text
	public idlePosition: Phaser.GameObjects.Rectangle
	public invisibleIdlePosition: Phaser.GameObjects.Rectangle
	private isInViewport: boolean
	private message: string

	constructor(scene: Phaser.Scene, initialState: ModeratorState, options: CCPGameObjectProps) {
		super(scene, options.x, options.y, MODERATOR_SPRITESHEET_KEY)
		this.setName('moderator')
		this.idlePosition = scene.physics.add.existing(
			new Phaser.GameObjects.Rectangle(
				this.scene,
				this.scene.game.canvas.width - 225,
				this.scene.game.canvas.height - 175,
				25,
				100
			)
		)
		this.message = initialState.message

		this.invisibleIdlePosition = scene.physics.add.existing(
			new Phaser.GameObjects.Rectangle(
				this.scene,
				this.scene.game.canvas.width + 550,
				this.scene.game.canvas.height - 175,
				25,
				100
			)
		)

		this.anims.create({
			key: MODERATOR_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 0,
				end: 7,
			}),
			frameRate: 5,
		})

		this.anims.create({
			key: MODERATOR_STATE_KEY.WALK_LEFT,
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 8,
				end: 9,
			}),
			frameRate: 5,
		})

		this.anims.create({
			key: MODERATOR_STATE_KEY.WALK_RIGHT,
			frames: this.anims.generateFrameNumbers(MODERATOR_SPRITESHEET_KEY, {
				start: 10,
				end: 11,
			}),
			frameRate: 5,
		})

		this.on('animationcomplete', (anim: Phaser.Animations.Animation, frame: number) => {
			this.emit('animationcomplete_' + anim.key, anim, frame)
		})

		this.on('animationcomplete_' + MODERATOR_STATE_KEY.WALK_LEFT, () => {
			this.idle()
		})

		this.on('animationcomplete_' + MODERATOR_STATE_KEY.WALK_RIGHT, () => {
			this.idle()
		})

		this.bubble = this.createSpeechBubble(scene, false)
		this.text = this.createBubbleText(scene, initialState.message, false)

		this.isInViewport = initialState.visibility

		this.setScale(2)
		scene.physics.add.existing(this)
		this.idle()
		options.layer.add(this)
		scene.add.existing(this)

		this.addTargetIdleCollider()
		this.addTargetInvisibleIdleCollider()
		this.handleState(initialState, true)
	}

	public addTargetIdleCollider() {
		const collider = this.scene.physics.add.overlap(
			this,
			this.idlePosition,
			(currentGameObject) => {
				this.emit(
					'animationcomplete_' + this.anims.currentAnim.key,
					this.anims.currentAnim,
					this.anims.currentAnim.frames
				)
				this.text.setVisible(true)
				this.bubble.setVisible(true)
				this.isInViewport = true
				currentGameObject.body.stop()
				this.scene.physics.world.removeCollider(collider)
			},
			undefined,
			this
		)
	}

	public addTargetInvisibleIdleCollider() {
		const collider2 = this.scene.physics.add.overlap(
			this,
			this.invisibleIdlePosition,
			(currentGameObject) => {
				this.emit(
					'animationcomplete_' + this.anims.currentAnim.key,
					this.anims.currentAnim,
					this.anims.currentAnim.frames
				)
				currentGameObject.body.stop()
				this.scene.physics.world.removeCollider(collider2)
			},
			undefined,
			this
		)
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === MODERATOR_STATE_KEY.IDLE) return
		this.play({ key: MODERATOR_STATE_KEY.IDLE, repeat: -1 })
	}

	public walkIn() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === MODERATOR_STATE_KEY.WALK_LEFT) return
		this.addTargetIdleCollider()
		this.scene.physics.moveToObject(this, this.idlePosition, 180)
		this.play({ key: MODERATOR_STATE_KEY.WALK_LEFT, repeat: -1 })
	}

	public walkOut() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === MODERATOR_STATE_KEY.WALK_RIGHT) return
		this.addTargetInvisibleIdleCollider()
		this.scene.physics.moveToObject(this, this.invisibleIdlePosition, 180)
		this.play({ key: MODERATOR_STATE_KEY.WALK_RIGHT, repeat: -1 })
	}

	public handleState(state: ModeratorState, isStart: boolean) {
		if (isStart && state.visibility) {
			this.isInViewport = true
			this.text = this.createBubbleText(this.scene, state.message, false)
			this.walkIn()
		}
		if (isStart) return

		if (this.message != state.message) {
			this.text.destroy()
			this.text = this.createBubbleText(this.scene, state.message, true)
		}
		if (this.isInViewport != state.visibility) {
			if (state.visibility) {
				this.walkIn()
			} else {
				this.walkOut()
				this.bubble.setVisible(false)
				this.text.setVisible(false)
			}
			this.isInViewport = state.visibility
		}
	}

	/**
	 * Inspired by https://phaser.io/examples/v3/view/game-objects/text/speech-bubble
	 */
	private createSpeechBubble(scene: Phaser.Scene, visible: boolean) {
		const bubble = new Phaser.GameObjects.Image(
			scene,
			scene.game.canvas.width - 365,
			this.y - 190,
			SPEECH_BUBBLE_SMALL_RIGHT_KEY
		)
		bubble.setScale(2.25)
		bubble.setVisible(visible)
		this.scene.add.existing(bubble)
		return bubble
	}

	private createBubbleText(scene: Phaser.Scene, message: string, visible: boolean) {
		const bubblePadding = 70
		this.message = message

		const content = scene.add.text(0, 0, message, {
			fontFamily: 'Roboto',
			fontSize: '20px',
			color: '#000000',
			align: 'center',
			wordWrap: { width: this.bubble.width + bubblePadding },
		})

		const b = content.getBounds()
		this.message = message
		content.setPosition(this.bubble.x - b.width / 2, this.bubble.y - b.height / 2 - 40)
		content.setVisible(visible)
		return content
	}
}
