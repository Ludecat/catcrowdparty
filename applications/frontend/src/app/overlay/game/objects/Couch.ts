import Phaser from 'phaser'
import { CrowdState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const COUCH_KEY = 'couch'

export class Couch extends Phaser.GameObjects.Image {
	constructor(scene: Phaser.Scene, crowdState: CrowdState, options: CCPGameObjectProps) {
		super(scene, options.x, options.y, COUCH_KEY)
		this.setName(COUCH_KEY)

		this.setScale(0.5)
		this.handleState(crowdState)
		options.layer.add(this)
		scene.add.existing(this)
	}

	public handleState(state: CrowdState) {
		this.setIsVisible(state.visibility)
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.setVisible(visible)
	}
}
