import { Client as TmiClient } from 'tmi.js'
import { twitchLogger as logger } from './logger'
import { TypedEmitter } from 'tiny-typed-emitter'
import TwitchChatEmotes, { NEW_EMOTES } from './TwitchChatEmotes'
import TwitchChatMessages, { NEW_EMOTE_MESSAGE } from './TwitchChatMessages'

interface TwitchChatHandlerEvents {
	[NEW_EMOTES]: (emoteUrls: string[]) => void
	[NEW_EMOTE_MESSAGE]: (senderName: string, color: string, emoteUrls: string[]) => void
}

const emoteIdsToUrls = (emoteIds: string[]) =>
	emoteIds.map((emoteId) => `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/2.0`)

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

		this.emotesHandler.on(NEW_EMOTES, (emoteIds) => {
			this.emit(NEW_EMOTES, emoteIdsToUrls(emoteIds))
		})

		this.messagesHandler.on(NEW_EMOTE_MESSAGE, (senderName, color, emoteIds) => {
			this.emit(NEW_EMOTE_MESSAGE, senderName, color, emoteIdsToUrls(emoteIds))
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

export { NEW_EMOTES, NEW_EMOTE_MESSAGE }
