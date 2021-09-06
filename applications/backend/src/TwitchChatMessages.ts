import { TypedEmitter } from 'tiny-typed-emitter'
import { Userstate } from 'tmi.js'

interface TwitchChatMessagesEvents {
	newEmoteMessage: (emoteIds: string[]) => void
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
				'newEmoteMessage',
				emoteSequence.map((t) => t[1])
			)
		}
	}
}
