export default class FrequencyTracker {
	private currentCount = 0
	private currentFrequency = 0
	constructor(private readonly checkWindow = 1000) {
		setInterval(() => this.updateFrequency(), checkWindow)
	}

	private updateFrequency() {
		this.currentFrequency = this.currentCount / this.checkWindow
		this.currentCount = 0
	}

	public addEvent() {
		this.currentCount += 1
	}

	public get frequency() {
		return this.currentFrequency
	}
}
