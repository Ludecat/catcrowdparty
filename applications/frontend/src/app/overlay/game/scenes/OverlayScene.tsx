import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	CCPSocketEventsMap,
	CrowdState,
	GlobalState,
	HotAirBallonVationsValues,
	HotAirBalloonVariation,
	HOT_AIR_BALLON_START,
	NEW_EMOTES_TRIGGER,
	NEW_EMOTE_MESSAGE_TRIGGER,
	REQUEST_STATE,
	STATE_UPDATE,
} from '@ccp/common/shared'
import { SCENES } from '../config'
import {
	CROWD_PERSON_BLUE_KEY,
	CROWD_PERSON_GREEN_KEY,
	CROWD_PERSON_PINK_KEY,
	CrowdPerson,
} from '../objects/CrowdPerson'
import { HotAirBalloon } from '../objects/HotAirBalloon'
import { Moderator, MODERATOR_SPRITESHEET_KEY, SPEECH_BUBBLE_SMALL_KEY } from '../objects/Moderator'
import { Emote } from '../objects/Emote'
import { getRandomInt } from '../../../util/utils'
import { EmoteBubble, SPEECH_BUBBLE_MEDIUM_KEY } from '../objects/EmoteBubble'

export const EMOTE_POS_Y = 850

export class OverlayScene extends Phaser.Scene {
	public crowd: CrowdPerson[] = []
	public moderator: Moderator | null = null
	public hotAirBalloons: HotAirBalloon[] = []
	public mainLayer: Phaser.GameObjects.Layer | null = null

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	private getActiveGameObjectsByName(name: string) {
		return this.children.list.filter((child) => child.name === name) as EmoteBubble[]
	}

	init(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		this.mainLayer = this.add.layer()

		config.socket.on(STATE_UPDATE, (state: GlobalState) => {
			for (const dude of this.crowd) {
				dude.handleState(state.crowd)
			}

			this.moderator?.handleState(state.moderator)

			for (const hotAirBalloon of this.hotAirBalloons) {
				hotAirBalloon.handleState(state.hotAirballon)
			}

			const activeEmotes = this.getActiveGameObjectsByName('emote')
			for (const emotes of activeEmotes) {
				emotes.handleState(state.emotes)
			}

			const activeEmoteBubbles = this.getActiveGameObjectsByName('emoteBubble')
			for (const bubble of activeEmoteBubbles) {
				bubble.handleState(state.bubbles)
			}
		})

		config.socket.on(HOT_AIR_BALLON_START, (data: HotAirBalloonVariation) => {
			for (const hotAirBalloon of this.hotAirBalloons) {
				hotAirBalloon.handleTrigger(data)
			}
		})

		config.socket.on(NEW_EMOTE_MESSAGE_TRIGGER, (senderName, emoteUrls, state) => {
			console.log(state.visibility)
			if (state.visibility) {
				let imageLoading
				for (const emoteURL of emoteUrls) {
					imageLoading = this.load.image(emoteURL, emoteURL)
					imageLoading.on('loaderror', () => {
						console.log('error while loading emote.')
					})
					imageLoading.start()
				}

				imageLoading?.on('complete', () => {
					new EmoteBubble(this, senderName, state, emoteUrls, {
						y: EMOTE_POS_Y,
						x: 300,
						layer: this.mainLayer!,
					})
				})
			}
		})

		config.socket.on(NEW_EMOTES_TRIGGER, (emoteUrls, state) => {
			if (state.visibility) {
				for (const emoteURL of emoteUrls) {
					if (this.textures.exists(emoteURL)) {
						new Emote(this, state, emoteURL, {
							y: 900,
							x: getRandomInt(100, this.game.canvas.width - 100),
							layer: this.mainLayer!,
						})
						continue
					}
					const imageLoading = this.load.image(emoteURL, emoteURL)
					imageLoading.on('filecomplete-image-' + emoteURL, () => {
						new Emote(this, state, emoteURL, {
							y: 900,
							x: getRandomInt(100, this.game.canvas.width - 100),
							layer: this.mainLayer!,
						})
					})
					imageLoading.on('loaderror', () => {
						console.log('error while loading emote.')
					})
					imageLoading.start()
				}
			}
		})
	}

	preload() {
		this.load.spritesheet(MODERATOR_SPRITESHEET_KEY, '/ccp_character_flo.png', {
			frameWidth: 80,
			frameHeight: 128,
		})
		this.load.spritesheet(HotAirBallonVationsValues.ludecat, '/hot_air_balloon_ludecat.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBallonVationsValues.fritzCola, '/hot_air_balloon_fritz_cola.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBallonVationsValues.fhSalzburg, '/hot_air_balloon_fh_salzburg.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.image(SPEECH_BUBBLE_SMALL_KEY, '/ccp_speechbubble_small_right.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_KEY, '/ccp_speechbubble_medium_right.png')

		this.load.spritesheet(CROWD_PERSON_BLUE_KEY, '/ccp_crowd_person_blue.png', {
			frameWidth: 120,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_GREEN_KEY, '/ccp_crowd_person_green.png', {
			frameWidth: 120,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_PINK_KEY, '/ccp_crowd_person_pink.png', {
			frameWidth: 120,
			frameHeight: 128,
		})
	}

	generateCrowdPerson(state: CrowdState, texture: string, y: number, xOffset: number) {
		for (let i = 0; i < 10; i++) {
			if (i === 0) {
				this.crowd.push(
					new CrowdPerson(
						this,
						state,
						{
							x: i * 160 + xOffset,
							y,
							layer: this.mainLayer!,
						},
						texture
					)
				)
				continue
			}

			this.crowd.push(new CrowdPerson(this, state, { x: i * 160 + xOffset, y, layer: this.mainLayer! }, texture))
		}
	}

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_PINK_KEY, 950, 150)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_GREEN_KEY, 975, 50)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_BLUE_KEY, 1000, 100)

		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, {
				x: -100,
				y: 400,
				variation: 'ludecat',
				layer: this.mainLayer!,
			})
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, {
				x: -100,
				y: 400,
				variation: 'fritz-cola',
				layer: this.mainLayer!,
			})
		)
		this.hotAirBalloons.push(
			new HotAirBalloon(this, initialState.hotAirballon, {
				x: -100,
				y: 400,
				variation: 'fh-salzburg',
				layer: this.mainLayer!,
			})
		)

		this.moderator = new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width - 130,
			y: this.game.canvas.height - 175,
			layer: this.mainLayer!,
		})

		socket.emit(REQUEST_STATE)
	}
}

export interface CCPGameObjectProps {
	x: number
	y: number
	layer: Phaser.GameObjects.Layer
}
