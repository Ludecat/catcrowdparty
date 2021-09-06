import { TypedEmitter } from 'tiny-typed-emitter'
import { Userstate } from 'tmi.js'

export const NEW_EMOTE_MESSAGE = 'newEmoteMessage'

interface TwitchChatMessagesEvents {
	[NEW_EMOTE_MESSAGE]: (senderName: string, emoteIds: string[]) => void
}

export default class TwitchChatMessages extends TypedEmitter<TwitchChatMessagesEvents> {
	public handleChatMessage(userstate: Userstate, message: string) {
		if (userstate.emotes !== undefined && userstate.emotes !== null) {
			const emoteSequence: Array<[string, string]> = []
			for (const [emoteId, positions] of Object.entries(userstate.emotes)) {
				for (const position of positions) {
					emoteSequence.push([position.split('-')[0], emoteId])
				}
			}
			emoteSequence.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
			this.emit(
				NEW_EMOTE_MESSAGE,
				userstate['display-name'] ?? 'unknown',
				emoteSequence.map((t) => t[1])
			)
		}
	}
}
