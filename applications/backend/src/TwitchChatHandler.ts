import { Client as TmiClient } from 'tmi.js'
import { twitchLogger as logger } from './logger'
import { TypedEmitter } from 'tiny-typed-emitter'
import TwitchChatEmotes from './TwitchChatEmotes'
import TwitchChatMessages from './TwitchChatMessages'

export const NEW_EMOTES = 'newEmotes'
export const NEW_EMOTE = 'newEmote'

interface TwitchChatHandlerEvents {
	[NEW_EMOTES]: (emoteUrls: string[]) => void
	[NEW_EMOTE]: (emoteUrl: string) => void
}

export default class TwitchChatHandler extends TypedEmitter<TwitchChatHandlerEvents> {
	private readonly tmi: TmiClient
	private readonly emotesHandler: TwitchChatEmotes
	private readonly messagesHandler: TwitchChatMessages

	constructor() {
		super()
		this.tmi = new TmiClient({
			connection: {
				secure: true,
				reconnect: true,
			},
			options: {
				debug: false,
			},
		})

		this.emotesHandler = new TwitchChatEmotes()
		this.messagesHandler = new TwitchChatMessages()

		this.tmi.on('chat', (channel, userstate, message, self) => {
			logger.debug(`New message from ${userstate['display-name']}: ${message}`)

			this.emotesHandler.handleChatMessage(userstate, message)
			this.messagesHandler.handleChatMessage(userstate, message)
		})

		this.emotesHandler.on('newEmote', (emoteId) => {
			this.emit(NEW_EMOTE, `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/2.0`)
		})

		this.messagesHandler.on('newEmoteMessage', (emoteIds) => {
			const emotes = emoteIds.map((emoteId) => `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/2.0`)
			this.emit(NEW_EMOTES, emotes)
		})

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.tryConnect()
	}

	private async tryConnect() {
		try {
			await this.connect()
		} catch (e) {
			logger.error('Failed to conntect to chat')
		}
	}

	private async connect() {
		await this.tmi.connect()

		const channel = process.env.TWITCH_CHANNEL ?? 'twitch'
		logger.info(`Joining channel ${channel}`)
		await this.tmi.join(channel)
	}
}
