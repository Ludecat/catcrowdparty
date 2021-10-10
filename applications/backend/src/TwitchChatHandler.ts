import { Client as TmiClient } from 'tmi.js'
import { twitchLogger as logger } from './logger'
import { TypedEmitter } from 'tiny-typed-emitter'
import TwitchChatEmotes, { NEW_EMOTES } from './TwitchChatEmotes'
import TwitchChatMessages, { NEW_EMOTE_MESSAGE } from './TwitchChatMessages'
import { initialSettingsState } from './State'

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
		this.tryConnect(initialSettingsState.twitchChannel)
	}

	public async tryConnect(channel: string) {
		try {
			await this.connect(channel)
		} catch (e) {
			logger.error('Failed to connect to chat.')
		}
	}

	private async connect(channel: string) {
		await this.tmi.connect()
		await this.tryJoinChannel(channel)
	}

	public async joinNewChannel(channel: string, channelToDisconnect: string) {
		logger.info(`Reconnecting to new channel ${channel}.`)
		await this.leaveChannel(channelToDisconnect)
		await this.tryJoinChannel(channel)
	}

	private async tryJoinChannel(channel: string) {
		try {
			logger.info(`Joining channel ${channel}`)
			await this.tmi.join(channel)
		} catch (e) {
			logger.warn(`Couldn't join channel ${channel}.`)
		}
	}

	private async leaveChannel(channelToDisconnect: string) {
		try {
			logger.info(`Disconnecting channel ${channelToDisconnect}.`)
			await this.tmi.part(channelToDisconnect)
		} catch (e) {
			logger.error('Failed to disconntect from chat.')
		}
	}
}

export { NEW_EMOTES, NEW_EMOTE_MESSAGE }
