import { TypedEmitter } from 'tiny-typed-emitter'
import { Userstate } from 'tmi.js'
import TokenBucket from './TokenBucket'
import { twitchLogger as logger } from './logger'
import FrequencyTracker from './FrequencyTracker'

export const NEW_EMOTES = 'newEmotes'

interface TwitchChatEmotesEvents {
	[NEW_EMOTES]: (emoteIds: string[]) => void
}

interface ChatMode {
	check: (userState: Userstate) => boolean
}

class SlowMode implements ChatMode {
	private readonly bucketPerUser = new Map<string, TokenBucket>()
	private readonly globalBucket = new TokenBucket(10, 1)

	public check(userstate: Userstate) {
		if (!this.globalBucket.canConsume(1)) {
			return false
		}

		let userBucket = this.bucketPerUser.get(userstate.login)
		if (userBucket === undefined) {
			userBucket = new TokenBucket(2, 0.2)
			this.bucketPerUser.set(userstate.login, userBucket)
		}

		if (userBucket.consume(1)) {
			this.globalBucket.consume(1)
			return true
		}

		return false
	}
}

class AnarchyMode implements ChatMode {
	private readonly globalBucket = new TokenBucket(100, 10)

	public check(userstate: Userstate) {
		return this.globalBucket.consume(1)
	}
}

export default class TwitchChatEmotes extends TypedEmitter<TwitchChatEmotesEvents> {
	private readonly slowMode = new SlowMode()
	private readonly anarchyMode = new AnarchyMode()
	private currentMode: ChatMode = this.slowMode
	private readonly frequencyTracker = new FrequencyTracker(1000)
	private lastAnarchy = 0

	public handleChatMessage(userstate: Userstate, message: string) {
		const containsEmotes = userstate.emotes !== null && userstate.emotes !== undefined

		if (containsEmotes && this.currentMode.check(userstate)) {
			this.emit(NEW_EMOTES, Object.keys(userstate.emotes ?? {}))
		}

		if (containsEmotes) {
			this.frequencyTracker.addEvent()
		}

		if (this.frequencyTracker.frequency > 10) {
			const now = Date.now()
			if (now > this.lastAnarchy + 300000) {
				this.lastAnarchy = now
				this.triggerAnarchy()
			}
		}
	}

	public triggerAnarchy(duration = 30000) {
		if (this.currentMode === this.anarchyMode) {
			logger.warn('Can not start anarchy mode because it is already active - ignoring request')
			return
		}

		this.currentMode = this.anarchyMode
		logger.info('Activating anarchy mode')

		setTimeout(() => {
			this.currentMode = this.slowMode
			logger.info('Activating slow mode')
		}, duration)
	}
}
