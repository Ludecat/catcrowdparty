import { Socket } from 'socket.io-client'
import {
	AUDIO_INPUT_VALUE_UPDATE,
	CCPSocketEventsMap,
	CROWD_JUMP_THRESHOLD,
	CROWD_PARTY_THRESHOLD,
	isJumpState,
	isPartyState,
} from '@ccp/common/shared'
import { getMediaStreamByDeviceId, resumeMediaPlay } from '../util/utils'

export class AudioManager {
	public audioContext: AudioContext
	private audioSource: MediaStreamAudioSourceNode | null = null
	private analyser: AnalyserNode | null = null
	private frequencyBinCount: Uint8Array | null = null

	private canvas: HTMLCanvasElement
	public canvasContext: CanvasRenderingContext2D

	private socket: Socket<CCPSocketEventsMap>
	private intervalId: number | undefined
	private currentFrequenciesPowerBatch: number[] = [0]

	constructor(socket: Socket<CCPSocketEventsMap>, canvas: HTMLCanvasElement, initialDeviceId: string) {
		this.audioContext = new window.AudioContext()
		this.canvas = canvas
		this.socket = socket
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

		this.canvasContext.font = '24px Roboto'
		this.startSocketTicker()
		this.loop()
	}

	startSocketTicker() {
		this.intervalId = window.setInterval(() => {
			const frequencyPowerSum = this.currentFrequenciesPowerBatch.reduce((num1, num2) => num1 + num2, 0)
			const averageFrequencyPower = frequencyPowerSum / this.currentFrequenciesPowerBatch.length

			this.socket.emit(AUDIO_INPUT_VALUE_UPDATE, {
				averageFrequencyPower,
			})
			this.currentFrequenciesPowerBatch = []
		}, 1000)

		this.socket.on('disconnect', () => {
			window.clearInterval(this.intervalId)
		})
	}

	loop() {
		window.requestAnimationFrame(this.loop)

		this.frequencyBinCount = new Uint8Array(this.analyser!.frequencyBinCount)
		this.analyser!.getByteFrequencyData(this.frequencyBinCount)

		this.drawBar()
	}

	drawBar() {
		this.clearCanvas()

		const maxPowerOfFrequencies = Math.max(...(this.frequencyBinCount ?? [0]))
		this.currentFrequenciesPowerBatch.push(maxPowerOfFrequencies)
		const mappedBarHeightToCanvasHeight = (maxPowerOfFrequencies / 255) * this.canvas.height

		this.setCanvasContextColorFromIntensity(maxPowerOfFrequencies)
		this.canvasContext.fillRect(0, this.canvas.height, this.canvas.width, -1 * mappedBarHeightToCanvasHeight)

		this.canvasContext.fillStyle = '#000000'
		this.drawBarIndicators()

		this.canvasContext.textAlign = 'center'
		this.canvasContext.fillText(`${maxPowerOfFrequencies} frequencies max power.`, this.canvas.width / 2, 30)
	}

	setCanvasContextColorFromIntensity(intensity: number) {
		let color = '#FFCC00'
		if (isJumpState(intensity)) {
			color = '#50C878'
		} else if (isPartyState(intensity)) {
			color = '#D284DD'
		}

		this.canvasContext.fillStyle = color
	}

	drawBarIndicators() {
		const canvasHeightUnitFromBottom = this.canvas.height / 255

		this.canvasContext.fillRect(
			0,
			this.canvas.height - canvasHeightUnitFromBottom * CROWD_JUMP_THRESHOLD,
			this.canvas.width,
			1
		)
		this.canvasContext.fillText(
			`JUMP`,
			this.canvas.width / 2,
			this.canvas.height - canvasHeightUnitFromBottom * CROWD_JUMP_THRESHOLD - 10
		)
		this.canvasContext.fillText(
			`PARTY`,
			this.canvas.width / 2,
			this.canvas.height - canvasHeightUnitFromBottom * CROWD_PARTY_THRESHOLD - 10
		)
		this.canvasContext.fillRect(
			0,
			this.canvas.height - canvasHeightUnitFromBottom * CROWD_PARTY_THRESHOLD,
			this.canvas.width,
			1
		)
		this.canvasContext.fillText(`IDLE`, this.canvas.width / 2, this.canvas.height - 10)
	}

	clearCanvas() {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	setInputSource = async (deviceId: string) => {
		const stream = await getMediaStreamByDeviceId(deviceId)
		if (stream) {
			this.audioSource?.disconnect()
			this.analyser?.disconnect()
			this.audioSource = this.audioContext.createMediaStreamSource(stream)
			this.analyser = this.audioContext.createAnalyser()
			this.audioSource.connect(this.analyser)

			// Enable this to hear audio input.
			// this.analyser.connect(this.audioContext.destination)
		}
	}
}
