import Phaser from 'phaser'
import { CrowdState, isJumpState, isPartyState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'
import { getRandomInt } from '../../../util/utils'

export const CROWD_PERSON_BLUE_KEY = 'crowdPersonBlue'
export const CROWD_PERSON_BLUE_DARKER_KEY = 'crowdPersonDarkerBlue'
export const CROWD_PERSON_BLUE_DARK_KEY = 'crowdPersonDarkBlue'

export const CROWD_PERSON_GREEN_KEY = 'crowdPersonGreen'
export const CROWD_PERSON_GREEN_DARKER_KEY = 'crowdPersonDarkerGreen'
export const CROWD_PERSON_GREEN_DARK_KEY = 'crowdPersonDarkGreen'

export const CROWD_PERSON_PINK_KEY = 'crowdPersonPink'
export const CROWD_PERSON_PINK_DARKER_KEY = 'crowdPersonDarkerPink'
export const CROWD_PERSON_PINK_DARK_KEY = 'crowdPersonDarkPink'

export const CROWD_PERSON_STATE_KEY = {
	IDLE: 'idle',
	JUMP: 'jump',
	PARTY: 'party',
	WALK_RIGHT: 'walkRightCrowdPerson',
	WALK_LEFT: 'walkLeftCrowdPerson',
}

interface CrowdPersonProps extends CCPGameObjectProps {
	idlePosition: { x: number; y: number }
	idleInvisiblePosition: { x: number; y: number }
}

export class CrowdPerson extends Phaser.GameObjects.Sprite {
	public idlePosition: Phaser.GameObjects.Rectangle
	public idleInvisiblePosition: Phaser.GameObjects.Rectangle
	private isMyVisible: boolean
	private movementSpeed: number

	constructor(
		scene: Phaser.Scene,
		crowdState: CrowdState,
		threshold: number[],
		options: CrowdPersonProps,
		texture: string
	) {
		super(scene, options.x, options.y, texture)
		this.setName('crowdperson')

		this.idlePosition = scene.physics.add.existing(
			new Phaser.GameObjects.Rectangle(this.scene, options.idlePosition.x, options.idlePosition.y, 25, 100)
		)

		this.idleInvisiblePosition = scene.physics.add.existing(
			new Phaser.GameObjects.Rectangle(
				this.scene,
				options.idleInvisiblePosition.x,
				options.idleInvisiblePosition.y,
				25,
				100
			)
		)

		const startDelay = getRandomInt(0, 250)

		this.movementSpeed = getRandomInt(350, 1000)

		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.IDLE,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 0,
				end: 1,
			}),
			frameRate: 3,
			delay: startDelay,
		})
		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.JUMP,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 2,
				end: 6,
			}),
			frameRate: 7,
			delay: startDelay,
		})
		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.PARTY,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 7,
				end: 11,
			}),
			frameRate: 7,
			delay: startDelay,
		})

		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.WALK_RIGHT,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 12,
				end: 13,
			}),
			frameRate: 8,
		})

		this.anims.create({
			key: CROWD_PERSON_STATE_KEY.WALK_LEFT,
			frames: this.anims.generateFrameNumbers(texture, {
				start: 14,
				end: 15,
			}),
			frameRate: 8,
		})

		this.on('animationcomplete', (anim: Phaser.Animations.Animation, frame: number) => {
			this.emit('animationcomplete_' + anim.key, anim, frame)
		})

		this.on('animationcomplete_' + CROWD_PERSON_STATE_KEY.WALK_LEFT, () => {
			this.idle()
		})

		this.on('animationcomplete_' + CROWD_PERSON_STATE_KEY.WALK_RIGHT, () => {
			this.idle()
		})
		this.isMyVisible = crowdState.visibility
		this.setScale(0.55)
		scene.physics.add.existing(this)
		this.handleState(crowdState, threshold, true)
		options.layer.add(this)
		scene.add.existing(this)
	}

	public handleState(state: CrowdState, threshold: number[], isStart: boolean) {
		if (isPartyState(state.intensity, threshold)) {
			this.party()
		} else if (isJumpState(state.intensity, threshold)) {
			this.jump()
		} else {
			this.idle()
		}

		if (isStart && state.visibility) {
			this.isMyVisible = true
			this.walkIn()
		}
		if (isStart) return

		if (this.isMyVisible != state.visibility) {
			this.movementSpeed = getRandomInt(350, 1000)
			if (state.visibility) {
				this.walkIn()
			} else {
				this.walkOut()
			}

			this.isMyVisible = state.visibility
			this.setIsVisible(state.visibility)
		}
	}

	public idle() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.IDLE) return
		this.play({ key: CROWD_PERSON_STATE_KEY.IDLE, repeat: -1 })
	}

	public party() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.PARTY) return
		this.play({ key: CROWD_PERSON_STATE_KEY.PARTY, repeat: -1 })
	}

	public jump() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.JUMP) return
		this.play({ key: CROWD_PERSON_STATE_KEY.JUMP, repeat: -1 })
	}

	public walkOut() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.WALK_LEFT) return
		this.addTargetInvisibleIdleCollider()
		this.scene.physics.moveToObject(this, this.idleInvisiblePosition, this.movementSpeed)
		this.play({ key: CROWD_PERSON_STATE_KEY.WALK_LEFT, repeat: -1 })
	}

	public addTargetInvisibleIdleCollider() {
		const collider2 = this.scene.physics.add.overlap(
			this,
			this.idleInvisiblePosition,
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

	public walkIn() {
		if (this.anims.currentAnim && this.anims.currentAnim.key === CROWD_PERSON_STATE_KEY.WALK_RIGHT) return
		this.addTargetIdleCollider()
		this.scene.physics.moveToObject(this, this.idlePosition, this.movementSpeed)
		this.play({ key: CROWD_PERSON_STATE_KEY.WALK_RIGHT, repeat: -1 })
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
				currentGameObject.body.stop()
				this.scene.physics.world.removeCollider(collider)
			},
			undefined,
			this
		)
	}

	public setIsVisible(visible: boolean) {
		if (this.isMyVisible === visible) return
		this.isMyVisible = visible
	}
}
