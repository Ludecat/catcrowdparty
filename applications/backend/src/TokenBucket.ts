export default class TokenBucket {
	private tokens: number
	private lastRefill: number
	constructor(private readonly capacity: number, private readonly fillRate: number) {
		this.tokens = capacity
		this.lastRefill = Date.now()
	}

	public consume(tokens = 1): boolean {
		this.replenish()

		if (this.tokens > tokens) {
			this.tokens -= tokens
			return true
		}
		return false
	}

	public canConsume(tokens = 1) {
		this.replenish()

		return this.tokens > tokens
	}

	private replenish() {
		const now = Date.now()
		const tokensToRefill = this.fillRate * (now - this.lastRefill)
		this.tokens = Math.min(this.capacity, this.tokens + tokensToRefill)
		this.lastRefill = now
	}
}
