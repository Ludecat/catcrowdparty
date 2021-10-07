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
	ZEPPELIN_START,
	ZeppelinVariation,
	ZeppelinVariationValues,
	ZeppelinState,
} from '@ccp/common/shared'
import { SCENES } from '../config'
import {
	CROWD_PERSON_BLUE_KEY,
	CROWD_PERSON_GREEN_KEY,
	CROWD_PERSON_PINK_KEY,
	CrowdPerson,
	CROWD_PERSON_GREEN_DARK_KEY,
	CROWD_PERSON_PINK_DARK_KEY,
	CROWD_PERSON_BLUE_DARK_KEY,
	CROWD_PERSON_BLUE_DARKER_KEY,
	CROWD_PERSON_GREEN_DARKER_KEY,
	CROWD_PERSON_PINK_DARKER_KEY,
} from '../objects/CrowdPerson'
import { HotAirBalloon } from '../objects/HotAirBalloon'
import {
	Moderator,
	MODERATOR_SPRITESHEET_KEY,
	SPEECH_BUBBLE_SMALL_LEFT_KEY,
	SPEECH_BUBBLE_SMALL_RIGHT_KEY,
} from '../objects/Moderator'
import { Emote } from '../objects/Emote'
import { getRandomInt } from '../../../util/utils'
import { EmoteBubble, SPEECH_BUBBLE_MEDIUM_RIGHT_KEY, SPEECH_BUBBLE_MEDIUM_LEFT_KEY } from '../objects/EmoteBubble'
import { Couch, COUCH_DARKER_KEY, COUCH_DARK_KEY, COUCH_KEY } from '../objects/Couch'
import { Zeppelin } from '../objects/Zeppelin'

export const EMOTE_POS_Y = 850

export interface CrowdPersonsWithBubble {
	[key: string]: CrowdPerson | null
}

export class OverlayScene extends Phaser.Scene {
	public mainLayer: Phaser.GameObjects.Layer | null = null
	public crowdPersonsWithBubble: CrowdPersonsWithBubble | Record<string, null> = {}

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		this.mainLayer = this.add.layer()

		config.socket.on(STATE_UPDATE, (state: GlobalState) => {
			const activeCrowd = this.getActiveGameObjectsByName<CrowdPerson>('crowdperson')
			for (const crowdPerson of activeCrowd) {
				crowdPerson.handleState(state.crowd, state.settings.crowdThreshold, false)
			}

			const activeCouches = this.getActiveGameObjectsByName<Couch>('couch')
			for (const couch of activeCouches) {
				couch.handleState(state.crowd)
			}

			const activeModerators = this.getActiveGameObjectsByName<Moderator>('moderator')
			for (const moderator of activeModerators) {
				moderator.handleState(state.moderator, false)
			}

			const activeHotAirBalloons = this.getActiveGameObjectsByName<HotAirBalloon>('hotAirBalloon')
			for (const hotAirBalloon of activeHotAirBalloons) {
				hotAirBalloon.handleState(state.hotAirballoon)
			}

			const activeZeppelins = this.getActiveGameObjectsByName<Zeppelin>('zeppelin')
			for (const zeppelin of activeZeppelins) {
				zeppelin.handleState(state.zeppelin)
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

		config.socket.on(ZEPPELIN_START, (data: ZeppelinVariation) => {
			const activeZeppelins = this.getActiveGameObjectsByName<Zeppelin>('zeppelin')
			for (const zeppelin of activeZeppelins) {
				zeppelin.handleTrigger(data)
			}
		})

		config.socket.on(NEW_EMOTE_MESSAGE_TRIGGER, async (senderName, color, emoteUrls, state) => {
			if (!state.visibility) {
				return
			}

			try {
				if (this.crowdPersonsWithBubble && this.getRandomAvailableCrowdPersonWithEmoteBubble()) {
					const crowdPersonEmoteBubble = this.getRandomAvailableCrowdPersonWithEmoteBubble()
					if (!crowdPersonEmoteBubble) return
					this.crowdPersonsWithBubble[crowdPersonEmoteBubble.texture.key] = null

					await this.prepareEmotes(emoteUrls)
					new EmoteBubble(this, senderName, state, emoteUrls, {
						y: crowdPersonEmoteBubble.y - 105,
						x: crowdPersonEmoteBubble.x - 130,
						layer: this.mainLayer!,
						crowdPersonsWithBubble: this.crowdPersonsWithBubble,
						crowdPerson: crowdPersonEmoteBubble,
						alignBubble: crowdPersonEmoteBubble.texture.key === CROWD_PERSON_GREEN_KEY ? 'left' : 'right',
						color,
					})
				}
			} catch (e) {
				console.log(`Failed to load/show emoteMessage: ${e}`)
			}
		})

		config.socket.on(NEW_EMOTES_TRIGGER, async (emoteUrls, state) => {
			if (!state.visibility) {
				return
			}

			try {
				await this.prepareEmotes(emoteUrls)

				for (const emoteURL of emoteUrls) {
					new Emote(this, state, emoteURL, {
						y: 900,
						x: getRandomInt(100, this.game.canvas.width - 100),
						layer: this.mainLayer!,
					})
				}
			} catch (e) {
				console.log(`Failed to load/show emotes: ${e}`)
			}
		})
	}

	preload() {
		this.load.spritesheet(MODERATOR_SPRITESHEET_KEY, '/ccp_character_flo.png', {
			frameWidth: 80,
			frameHeight: 128,
		})
		this.load.spritesheet(HotAirBalloonVationsValues.ludecat, '/hot_air_balloon_ludecat.png', {
			frameWidth: 192,
			frameHeight: 400,
		})
		this.load.spritesheet(HotAirBalloonVationsValues.fritzCola, '/hot_air_balloon_fritz_cola.png', {
			frameWidth: 192,
			frameHeight: 400,
		})
		this.load.spritesheet(HotAirBalloonVationsValues.fhSalzburg, '/hot_air_balloon_fh_salzburg.png', {
			frameWidth: 192,
			frameHeight: 400,
		})

		this.load.spritesheet(ZeppelinVariationValues.razer, '/zeppelin/ccp_zeppelin_razer.png', {
			frameWidth: 321,
			frameHeight: 122,
		})
		this.load.spritesheet(ZeppelinVariationValues.willhaben, '/zeppelin/ccp_zeppelin_willhaben.png', {
			frameWidth: 321,
			frameHeight: 122,
		})
		this.load.spritesheet(ZeppelinVariationValues.ubisoft, '/zeppelin/ccp_zeppelin_ubisoft.png', {
			frameWidth: 321,
			frameHeight: 122,
		})
		this.load.spritesheet(ZeppelinVariationValues.akSalzburg, '/zeppelin/ccp_zeppelin_ak_salzburg.png', {
			frameWidth: 321,
			frameHeight: 122,
		})
		this.load.spritesheet(ZeppelinVariationValues.fritzKola, '/zeppelin/ccp_zeppelin_fritz_kola.png', {
			frameWidth: 321,
			frameHeight: 122,
		})
		this.load.spritesheet(ZeppelinVariationValues.nerdic, '/zeppelin/ccp_zeppelin_nerdic.png', {
			frameWidth: 321,
			frameHeight: 122,
		})

		this.load.image(SPEECH_BUBBLE_SMALL_RIGHT_KEY, '/ccp_speechbubble_small_right.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_RIGHT_KEY, '/ccp_speechbubble_medium_right.png')
		this.load.image(SPEECH_BUBBLE_SMALL_LEFT_KEY, '/ccp_speechbubble_small_left.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_LEFT_KEY, '/ccp_speechbubble_medium_left.png')
		this.load.image(COUCH_KEY, '/ccp_couch.png')
		this.load.image(COUCH_DARKER_KEY, '/ccp_couch_darker.png')
		this.load.image(COUCH_DARK_KEY, '/ccp_couch_dark.png')

		this.load.spritesheet(CROWD_PERSON_BLUE_KEY, '/ccp_crowd_person_blue.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_BLUE_DARK_KEY, '/ccp_crowd_person_blue_dark.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_BLUE_DARKER_KEY, '/ccp_crowd_person_blue_darker.png', {
			frameWidth: 128,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_GREEN_KEY, '/ccp_crowd_person_green.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_GREEN_DARK_KEY, '/ccp_crowd_person_green_dark.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_GREEN_DARKER_KEY, '/ccp_crowd_person_green_darker.png', {
			frameWidth: 128,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_PINK_KEY, '/ccp_crowd_person_pink.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_PINK_DARK_KEY, '/ccp_crowd_person_pink_dark.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
		this.load.spritesheet(CROWD_PERSON_PINK_DARKER_KEY, '/ccp_crowd_person_pink_darker.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
	}

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const couchPositionFromBottomStart = 32
		const crowdPersonRowFromBottomStart = 84
		const couchRowWithCrowdPersonInbetweenDistance = 32

		this.generateCrowdPerson(
			initialState.crowd,
			initialState.settings.crowdThreshold,
			CROWD_PERSON_PINK_DARK_KEY,
			this.game.canvas.height - crowdPersonRowFromBottomStart - couchRowWithCrowdPersonInbetweenDistance * 2,
			130,
			9,
			2
		)
		this.generateCouchRow(
			initialState.crowd,
			this.game.canvas.height - couchPositionFromBottomStart - couchRowWithCrowdPersonInbetweenDistance * 2,
			-20,
			COUCH_DARK_KEY,
			8
		)
		this.generateCrowdPerson(
			initialState.crowd,
			initialState.settings.crowdThreshold,
			CROWD_PERSON_GREEN_DARKER_KEY,
			this.game.canvas.height - crowdPersonRowFromBottomStart - couchRowWithCrowdPersonInbetweenDistance,
			50,
			10,
			5
		)
		this.generateCouchRow(
			initialState.crowd,
			this.game.canvas.height - couchPositionFromBottomStart - couchRowWithCrowdPersonInbetweenDistance,
			30,
			COUCH_DARKER_KEY,
			8
		)
		this.generateCrowdPerson(
			initialState.crowd,
			initialState.settings.crowdThreshold,
			CROWD_PERSON_BLUE_KEY,
			this.game.canvas.height - crowdPersonRowFromBottomStart,
			100,
			10,
			9
		)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - couchPositionFromBottomStart, 80, COUCH_KEY, 8)

		this.generateHotAirBalloons(initialState.hotAirballoon)
		this.generateZeppelin(initialState.zeppelin)
		new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width + 250,
			y: this.game.canvas.height - 175,
			layer: this.mainLayer!,
		})

		socket.emit(REQUEST_STATE)
	}

	getRandomAvailableCrowdPersonWithEmoteBubble() {
		if (!this.crowdPersonsWithBubble) return null
		const keys = Object.keys(this.crowdPersonsWithBubble)
		const availableCrowdPersons = []
		for (const key of keys) {
			if (this.crowdPersonsWithBubble[key]) {
				availableCrowdPersons.push(this.crowdPersonsWithBubble[key])
			}
		}
		return availableCrowdPersons[Math.floor(Math.random() * availableCrowdPersons.length)]
	}

	generateCrowdPerson(
		state: CrowdState,
		threshold: number[],
		texture: string,
		y: number,
		xOffset: number,
		count: number,
		crowdPersonWithBubbleIndex: number
	) {
		const inbetweenDistance = 150
		for (let i = 0; i < count; i++) {
			const outOfScreenPositionX = i * -1 - inbetweenDistance - xOffset
			const onScreenPositionX = i * inbetweenDistance + xOffset

			if (i === 0) {
				new CrowdPerson(
					this,
					state,
					threshold,
					{
						x: outOfScreenPositionX,
						y,
						layer: this.mainLayer!,
						idleInvisiblePosition: {
							x: outOfScreenPositionX,
							y,
						},
						idlePosition: {
							x: onScreenPositionX,
							y,
						},
					},
					texture
				)

				continue
			}

			if (i === crowdPersonWithBubbleIndex) {
				this.crowdPersonsWithBubble[texture] = new CrowdPerson(
					this,
					state,
					threshold,
					{
						x: outOfScreenPositionX,
						y,
						layer: this.mainLayer!,
						idleInvisiblePosition: {
							x: outOfScreenPositionX,
							y,
						},
						idlePosition: {
							x: onScreenPositionX,
							y,
						},
					},
					texture
				)
			} else {
				new CrowdPerson(
					this,
					state,
					threshold,
					{
						x: outOfScreenPositionX,
						y,
						layer: this.mainLayer!,
						idleInvisiblePosition: {
							x: outOfScreenPositionX,
							y,
						},
						idlePosition: {
							x: onScreenPositionX,
							y,
						},
					},
					texture
				)
			}
		}
	}

	generateCouchRow(state: CrowdState, y: number, xOffset: number, texture: string, count: number) {
		for (let i = 0; i < count; i++) {
			if (i === 0) {
				new Couch(this, state, {
					x: i * 200 + xOffset,
					y,
					layer: this.mainLayer!,
					texture,
				})
				continue
			}

			new Couch(this, state, { x: i * 200 + xOffset, y, layer: this.mainLayer!, texture })
		}
	}

	generateHotAirBalloons(state: HotAirBalloonState) {
		new HotAirBalloon(this, state, {
			x: -100,
			y: 350,
			variation: 'ludecat',
			layer: this.mainLayer!,
			direction: 'goRight',
		})
		new HotAirBalloon(this, state, {
			x: this.game.canvas.width + 100,
			y: 400,
			variation: 'fritz-cola',
			layer: this.mainLayer!,
			direction: 'goLeft',
		})
		new HotAirBalloon(this, state, {
			x: -100,
			y: 440,
			variation: 'fh-salzburg',
			layer: this.mainLayer!,
			direction: 'goRight',
		})
	}

	generateZeppelin(state: ZeppelinState) {
		const threshold = 250
		new Zeppelin(this, state, {
			x: -threshold,
			y: 350,
			variation: 'razer',
			layer: this.mainLayer!,
			direction: 'goRight',
		})
		new Zeppelin(this, state, {
			x: this.game.canvas.width + threshold,
			y: 400,
			variation: 'willhaben',
			layer: this.mainLayer!,
			direction: 'goLeft',
		})
		new Zeppelin(this, state, {
			x: -threshold,
			y: 440,
			variation: 'ubisoft',
			layer: this.mainLayer!,
			direction: 'goRight',
		})
		new Zeppelin(this, state, {
			x: -threshold,
			y: 440,
			variation: 'fritzKola',
			layer: this.mainLayer!,
			direction: 'goLeft',
		})
		new Zeppelin(this, state, {
			x: -threshold,
			y: 440,
			variation: 'akSalzburg',
			layer: this.mainLayer!,
			direction: 'goRight',
		})
		new Zeppelin(this, state, {
			x: -threshold,
			y: 440,
			variation: 'nerdic',
			layer: this.mainLayer!,
			direction: 'goLeft',
		})
	}

	private getActiveGameObjectsByName<T>(name: string) {
		return this.children.list.filter((child) => child.name === name) as never as T[]
	}

	private async prepareEmotes(emoteUrls: string[]) {
		const emoteLoads = Array<Promise<void>>()
		for (const emoteURL of emoteUrls) {
			emoteLoads.push(this.loadImage(emoteURL))
		}
		await Promise.all(emoteLoads)
	}

	private loadImage(url: string): Promise<void> {
		return new Promise((resolve) => {
			if (this.textures.exists(url)) {
				resolve()
				return
			}
			this.load.image(url, url)
			this.load.once('filecomplete-image-' + url, () => {
				resolve()
			})

			this.load.start()
		})
	}
}

export interface CCPGameObjectProps {
	x: number
	y: number
	layer: Phaser.GameObjects.Layer
}
