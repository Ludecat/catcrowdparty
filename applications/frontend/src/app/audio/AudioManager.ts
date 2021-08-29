import { getMediaStreamByDeviceId, resumeMediaPlay } from '../util/utils'

export class AudioManager {
	public audioContext: AudioContext
	private audioSource: MediaStreamAudioSourceNode | null = null
	private analyser: AnalyserNode | null = null
	private frequencyBinCount: Uint8Array | null = null

	private canvas: HTMLCanvasElement
	public canvasContext: CanvasRenderingContext2D

	private currentDecibelBatch: number[] = [0]

	constructor(canvas: HTMLCanvasElement, initialDeviceId: string) {
		this.audioContext = new window.AudioContext()
		this.canvas = canvas
		this.canvasContext = canvas.getContext('2d')!

		// https://developer.chrome.com/blog/autoplay/#web-audio
		window.onclick = () => resumeMediaPlay(this.audioContext)

		this.loop = this.loop.bind(this)
		this.start(initialDeviceId)
	}

	async start(deviceId: string) {
		await this.setInputSource(deviceId)
		this.analyser = this.audioContext.createAnalyser()

		// audioSource set by setInputSource()
		this.audioSource!.connect(this.analyser)

		this.analyser.connect(this.audioContext.destination)
		this.canvasContext.font = '24px Roboto'
		this.startRollingDecibelTicker()
		this.loop()
	}

	startRollingDecibelTicker() {
		window.setInterval(() => {
			const arrSum = this.currentDecibelBatch.reduce((num1, num2) => num1 + num2, 0)
			console.log(arrSum / this.currentDecibelBatch.length)
			this.currentDecibelBatch = []
		}, 1000)
	}

	loop() {
		window.requestAnimationFrame(this.loop)

		this.frequencyBinCount = new Uint8Array(this.analyser!.frequencyBinCount)
		this.analyser!.getByteFrequencyData(this.frequencyBinCount)

		this.drawBar()
	}

	drawBar() {
		this.clearCanvas()

		this.canvasContext.fillStyle = '#FFCC00'
		const maxFbcDecibel = Math.max(...(this.frequencyBinCount ?? [0]))
		this.currentDecibelBatch.push(maxFbcDecibel)
		const mappedBarHeightToCanvasHeight = (maxFbcDecibel / 255) * this.canvas.height

		this.canvasContext.fillRect(0, this.canvas.height, this.canvas.width, -1 * mappedBarHeightToCanvasHeight)
		this.canvasContext.fillStyle = '#000000'

		this.canvasContext.fillText(`${maxFbcDecibel}dB`, this.canvas.width / 2, this.canvas.height / 2)
	}

	clearCanvas() {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	setInputSource = async (deviceId: string) => {
		const stream = await getMediaStreamByDeviceId(deviceId)
		if (stream) {
			this.audioSource?.disconnect()
			this.analyser?.disconnect()
			this.analyser?.disconnect()
			this.audioSource = this.audioContext.createMediaStreamSource(stream)
			this.analyser = this.audioContext.createAnalyser()
			this.audioSource!.connect(this.analyser)

			// Enable this to hear audio input.
			// this.analyser.connect(this.audioContext.destination)
		}
	}
}
