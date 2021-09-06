import { TypedEmitter } from 'tiny-typed-emitter'
import { Userstate } from 'tmi.js'

const COOLDOWN = 5000

interface TwitchChatEmotesEvents {
	newEmote: (emoteId: string) => void
}

export default class TwitchChatEmotes extends TypedEmitter<TwitchChatEmotesEvents> {
	private lastEmoteEmitted = 0

	public handleChatMessage(userstate: Userstate, message: string) {
		const containsEmotes = userstate.emotes !== null && userstate.emotes !== undefined
		const now = Date.now()
		const isOnCooldown = now - this.lastEmoteEmitted < COOLDOWN

		if (containsEmotes && !isOnCooldown) {
			this.lastEmoteEmitted = now
			this.emit('newEmote', Object.keys(userstate.emotes ?? {})[0])
		}
	}
}
