import { Client as TmiClient } from 'tmi.js'
import { twitchLogger as logger } from './logger'

export default class TwitchChatHandler {
	private readonly tmi: TmiClient

	constructor() {
		this.tmi = new TmiClient({
			connection: {
				secure: true,
				reconnect: true,
			},
			options: {
				debug: false,
			},
		})

		this.tmi.on('chat', (channel, userstate, message, self) => {
			logger.debug(`New message from ${userstate['display-name']}: ${message}`)
			if (userstate.emotes !== undefined && userstate.emotes !== null) {
				const emotes = Object.keys(userstate.emotes).map(
					(emoteId) => `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/2.0`
				)
				logger.debug(JSON.stringify(emotes))
			}
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
