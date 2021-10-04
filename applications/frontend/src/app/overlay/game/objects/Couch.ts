import Phaser from 'phaser'
import { CrowdState } from '@ccp/common/shared'
import { CCPGameObjectProps } from '../scenes/OverlayScene'

export const COUCH_KEY = 'couch'
export const COUCH_DARKER_KEY = 'darkerCouch'
export const COUCH_DARK_KEY = 'darkCouch'

interface CouchProps extends CCPGameObjectProps {
	texture: string
}

export class Couch extends Phaser.GameObjects.Image {
	constructor(scene: Phaser.Scene, crowdState: CrowdState, options: CouchProps) {
		super(scene, options.x, options.y, options.texture)
		this.setName(options.texture)

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
