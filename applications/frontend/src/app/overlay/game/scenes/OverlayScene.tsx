import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import {
	CCPSocketEventsMap,
	CrowdState,
	GlobalState,
	HotAirBalloonState,
	HotAirBalloonVationsValues,
	HotAirBalloonVariation,
	HOT_AIR_BALLOON_START,
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
import { Couch, COUCH_KEY } from '../objects/Couch'

export const EMOTE_POS_Y = 850

export class OverlayScene extends Phaser.Scene {
	public mainLayer: Phaser.GameObjects.Layer | null = null

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		this.mainLayer = this.add.layer()

		config.socket.on(STATE_UPDATE, (state: GlobalState) => {
			const activeCrowd = this.getActiveGameObjectsByName<CrowdPerson>('crowdperson')
			for (const crowdPerson of activeCrowd) {
				crowdPerson.handleState(state.crowd)
			}

			const activeCouches = this.getActiveGameObjectsByName<Couch>('couch')
			for (const couch of activeCouches) {
				couch.handleState(state.crowd)
			}

			const activeModerators = this.getActiveGameObjectsByName<Moderator>('moderator') as Moderator[]
			for (const mmoderator of activeModerators) {
				mmoderator.handleState(state.moderator)
			}

			const activeHotAirBalloons = this.getActiveGameObjectsByName<HotAirBalloon>('hotAirBalloon')
			for (const hotAirBalloon of activeHotAirBalloons) {
				hotAirBalloon.handleState(state.hotAirballoon)
			}

			const activeEmotes = this.getActiveGameObjectsByName<Emote>('emote')
			for (const emotes of activeEmotes) {
				emotes.handleState(state.emotes)
			}

			const activeEmoteBubbles = this.getActiveGameObjectsByName<EmoteBubble>('emoteBubble')
			for (const bubble of activeEmoteBubbles) {
				bubble.handleState(state.bubbles)
			}
		})

		config.socket.on(HOT_AIR_BALLOON_START, (data: HotAirBalloonVariation) => {
			const activeHotAirBalloons = this.getActiveGameObjectsByName<HotAirBalloon>('hotAirBalloon')
			for (const hotAirBalloon of activeHotAirBalloons) {
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
		this.load.spritesheet(HotAirBalloonVationsValues.ludecat, '/hot_air_balloon_ludecat.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBalloonVationsValues.fritzCola, '/hot_air_balloon_fritz_cola.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.spritesheet(HotAirBalloonVationsValues.fhSalzburg, '/hot_air_balloon_fh_salzburg.png', {
			frameWidth: 61,
			frameHeight: 92,
		})
		this.load.image(SPEECH_BUBBLE_SMALL_KEY, '/ccp_speechbubble_small_right.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_KEY, '/ccp_speechbubble_medium_right.png')
		this.load.image(COUCH_KEY, '/ccp_couch.png')

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

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config

		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_PINK_KEY, 930, 150, 9)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 100, 80)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_GREEN_KEY, 956, 50, 10)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 75, 80)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_BLUE_KEY, 980, 100, 10)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 50, 80)

		this.generateHotAirBalloons(initialState.hotAirballoon)

		new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width - 130,
			y: this.game.canvas.height - 175,
			layer: this.mainLayer!,
		})

		socket.emit(REQUEST_STATE)
	}

	generateCrowdPerson(state: CrowdState, texture: string, y: number, xOffset: number, count: number) {
		for (let i = 0; i < count; i++) {
			if (i === 0) {
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

				continue
			}

			new CrowdPerson(this, state, { x: i * 160 + xOffset, y, layer: this.mainLayer! }, texture)
		}
	}

	generateCouchRow(state: CrowdState, y: number, xOffset: number) {
		for (let i = 0; i < 8; i++) {
			if (i === 0) {
				new Couch(this, state, {
					x: i * 200 + xOffset,
					y,
					layer: this.mainLayer!,
				})
				continue
			}

			new Couch(this, state, { x: i * 200 + xOffset, y, layer: this.mainLayer! })
		}
	}

	generateHotAirBalloons(state: HotAirBalloonState) {
		new HotAirBalloon(this, state, {
			x: -100,
			y: 400,
			variation: 'ludecat',
			layer: this.mainLayer!,
		})
		new HotAirBalloon(this, state, {
			x: -100,
			y: 400,
			variation: 'fritz-cola',
			layer: this.mainLayer!,
		})
		new HotAirBalloon(this, state, {
			x: -100,
			y: 400,
			variation: 'fh-salzburg',
			layer: this.mainLayer!,
		})
	}

	private getActiveGameObjectsByName<T>(name: string) {
		return this.children.list.filter((child) => child.name === name) as never as T[]
	}
}

export interface CCPGameObjectProps {
	x: number
	y: number
	layer: Phaser.GameObjects.Layer
}
