import { getMediaStreamByDeviceId, resumeMediaPlay } from '../util/utils'

export class AudioManager {
	private audioContext: AudioContext | null = null
	private audioSource: MediaStreamAudioSourceNode | null = null
	private analyser: AnalyserNode | null = null
	private frequencyBinCount: Uint8Array | null = null

	private canvas: HTMLCanvasElement
	private canvasContext: CanvasRenderingContext2D

	constructor(canvas: HTMLCanvasElement, initialDeviceId: string) {
		this.audioContext = new window.AudioContext() || null
		this.canvas = canvas
		this.canvasContext = canvas.getContext('2d')!

		// https://developer.chrome.com/blog/autoplay/#web-audio
		if (this.audioContext !== null) {
			window.onclick = () => resumeMediaPlay(this.audioContext!)
		}

		this.loop = this.loop.bind(this)
		this.start(initialDeviceId)
	}

	async start(deviceId: string) {
		await this.setInputSource(deviceId)
		this.analyser = this.audioContext!.createAnalyser()
		this.audioSource!.connect(this.analyser)
		this.analyser.connect(this.audioContext!.destination)
		this.loop()
	}

	loop() {
		window.requestAnimationFrame(this.loop)

		this.frequencyBinCount = new Uint8Array(this.analyser!.frequencyBinCount)
		this.analyser!.getByteFrequencyData(this.frequencyBinCount)

		this.drawBar()
	}

	drawBar() {
		this.clearCanvas()

		this.canvasContext.fillStyle = '#FF0000'
		const maxFbcDecibel = Math.max(...(this.frequencyBinCount ?? [0]))
		this.canvasContext.fillRect(0, this.canvas.height, this.canvas.width, (-1 * maxFbcDecibel) / 2)
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
			this.audioSource = this.audioContext!.createMediaStreamSource(stream)
			this.analyser = this.audioContext!.createAnalyser()
			this.audioSource!.connect(this.analyser)
			this.analyser.connect(this.audioContext!.destination)
		}
	}
}
