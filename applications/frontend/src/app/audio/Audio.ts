export class AudioManager {
	private context: AudioContext | undefined
	private inputSource: MediaStreamAudioSourceNode | undefined
	private analyser: AnalyserNode | undefined
	private canvas: HTMLCanvasElement
	private canvasContext: CanvasRenderingContext2D
	private frequencyArr: Uint8Array | null = null

	constructor(canvas: HTMLCanvasElement, initialDeviceId: string) {
		this.context = new window.AudioContext() || null
		this.canvas = canvas
		this.canvasContext = canvas.getContext('2d')!

		// https://developer.chrome.com/blog/autoplay/#web-audio
		window.onclick = () => {
			this.context!.resume().then(() => {
				console.log('Playback resumed successfully')
			})
		}

		this.canvasContext.fillStyle = '#FF0000'
		this.canvasContext.fillRect(0, 300, 300, 300)
		this.loop = this.loop.bind(this)
		this.start(initialDeviceId)
	}

	setInputSource = async (deviceId: string) => {
		const stream = await this.getMediaStreamByDeviceId(deviceId)
		if (stream) {
			this.inputSource?.disconnect()
			this.analyser?.disconnect()
			this.analyser?.disconnect()
			this.inputSource = this.context!.createMediaStreamSource(stream)
			this.analyser = this.context!.createAnalyser()
			this.inputSource!.connect(this.analyser)
			this.analyser.connect(this.context!.destination)
		}
	}

	async start(deviceId: string) {
		await this.setInputSource(deviceId)
		this.analyser = this.context!.createAnalyser()
		this.inputSource!.connect(this.analyser)
		this.analyser.connect(this.context!.destination)
		this.loop()
	}

	loop() {
		window.requestAnimationFrame(this.loop)
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.frequencyArr = new Uint8Array(this.analyser!.frequencyBinCount)
		this.analyser!.getByteFrequencyData(this.frequencyArr)
		this.canvasContext.fillStyle = '#FF0000'

		const maxDecibelOfAllFrequencies = Math.max(...this.frequencyArr)
		console.log(`maxDecibelOfAllFrequencies: ${maxDecibelOfAllFrequencies}`)
		this.canvasContext.fillRect(0, this.canvas.height, this.canvas.width, (-1 * maxDecibelOfAllFrequencies) / 2)
	}

	async getMediaStreamByDeviceId(deviceId: string) {
		try {
			return await navigator.mediaDevices.getUserMedia({
				audio: {
					advanced: [
						{
							deviceId,
						},
					],
				},
				video: false,
			})
		} catch (err) {
			console.log(err)
			return null
		}
	}
}
