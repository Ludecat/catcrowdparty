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
import { HotAirBalloon, PARTICLE_KEY } from '../objects/HotAirBalloon'
import {
	Moderator,
	MODERATOR_SPRITESHEET_KEY,
	SPEECH_BUBBLE_SMALL_LEFT_KEY,
	SPEECH_BUBBLE_SMALL_RIGHT_KEY,
} from '../objects/Moderator'
import { Emote } from '../objects/Emote'
import { getRandomInt } from '../../../util/utils'
import { EmoteBubble, SPEECH_BUBBLE_MEDIUM_RIGHT_KEY, SPEECH_BUBBLE_MEDIUM_LEFT_KEY } from '../objects/EmoteBubble'
import { Couch, COUCH_KEY } from '../objects/Couch'

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
				crowdPerson.handleState(state.crowd)
			}

			const activeCouches = this.getActiveGameObjectsByName<Couch>('couch')
			for (const couch of activeCouches) {
				couch.handleState(state.crowd)
			}

			const activeModerators = this.getActiveGameObjectsByName<Moderator>('moderator')
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

		config.socket.on(NEW_EMOTE_MESSAGE_TRIGGER, async (senderName, emoteUrls, state) => {
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
		this.load.image(PARTICLE_KEY, '/ccp_particle_red.png')

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
		this.load.image(SPEECH_BUBBLE_SMALL_RIGHT_KEY, '/ccp_speechbubble_small_right.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_RIGHT_KEY, '/ccp_speechbubble_medium_right.png')
		this.load.image(SPEECH_BUBBLE_SMALL_LEFT_KEY, '/ccp_speechbubble_small_left.png')
		this.load.image(SPEECH_BUBBLE_MEDIUM_LEFT_KEY, '/ccp_speechbubble_medium_left.png')

		this.load.image(COUCH_KEY, '/ccp_couch.png')

		this.load.spritesheet(CROWD_PERSON_BLUE_KEY, '/ccp_crowd_person_blue.png', {
			frameWidth: 128,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_GREEN_KEY, '/ccp_crowd_person_green.png', {
			frameWidth: 128,
			frameHeight: 128,
		})

		this.load.spritesheet(CROWD_PERSON_PINK_KEY, '/ccp_crowd_person_pink.png', {
			frameWidth: 128,
			frameHeight: 128,
		})
	}

	create(config: { socket: Socket<CCPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config

		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_PINK_KEY, 930, 150, 9, 2)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 100, 80)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_GREEN_KEY, 956, 50, 10, 5)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 75, 80)
		this.generateCrowdPerson(initialState.crowd, CROWD_PERSON_BLUE_KEY, 980, 100, 10, 9)
		this.generateCouchRow(initialState.crowd, this.game.canvas.height - 50, 80)

		this.generateHotAirBalloons(initialState.hotAirballoon)

		new Moderator(this, initialState.moderator, {
			x: this.game.canvas.width - 130,
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
		texture: string,
		y: number,
		xOffset: number,
		count: number,
		crowdPersonWithBubbleIndex: number
	) {
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

			if (i === crowdPersonWithBubbleIndex) {
				this.crowdPersonsWithBubble[texture] = new CrowdPerson(
					this,
					state,
					{ x: i * 160 + xOffset, y, layer: this.mainLayer! },
					texture
				)
			} else {
				new CrowdPerson(this, state, { x: i * 160 + xOffset, y, layer: this.mainLayer! }, texture)
			}
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
