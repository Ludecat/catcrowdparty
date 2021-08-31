import React, { useEffect, useState, useCallback } from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'
import { AudioManager } from '../../app/audio/AudioManager'
import Select from 'react-select'
import { styled } from '../../app/styles/Theme'
import { useSocket } from '../../app/hooks/useSocket'
import { useIsMounted } from '../../app/hooks/useIsMounted'

export interface OverlayPageProps {
	title?: string
}

interface Selectable {
	label: string
	value: string
}

const mapAudioDevicesToSelectable = (inputAudioDevices: MediaDeviceInfo[]) => {
	return inputAudioDevices.map((device) => {
		return {
			label: device.label,
			value: device.deviceId,
		}
	})
}

const findDefaultMediaSource = (selectable: Selectable[]) => {
	return selectable.find((device) => device.value === 'default') as Selectable
}

const dropDownHeight = 38
const AudioPage: NextPage<OverlayPageProps> = (props: OverlayPageProps) => {
	const { title } = props

	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
	const audioManager = React.useRef<AudioManager | null>(null)
	const { socket } = useSocket()
	const [isAudioContextEnabled, setIsAudioContextEnabled] = useState<boolean | null>(null)
	const isMounted = useIsMounted()

	const [inputMediaDevices, setInputMediaDevices] = useState<Selectable[]>([])
	const [currentInputDevice, setCurrentInputdevice] = useState<Selectable | null>(null)

	const getAudioInputDevices = useCallback(async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices()
		return mediaDevices.filter((device) => device.kind === 'audioinput')
	}, [])

	useEffect(() => {
		resizeCanvas()
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/focus
		window.focus()
		window.addEventListener('resize', resizeCanvas)
		return () => window.removeEventListener('resize', resizeCanvas)
	}, [])

	const resizeCanvas = useCallback(() => {
		if (canvasRef.current) {
			canvasRef.current.width = window.innerWidth
			canvasRef.current.height = window.innerHeight - dropDownHeight
		}
		window.focus()
	}, [canvasRef.current])

	useEffect(() => {
		const setAudioInputDevices = async () => {
			const devices = await getAudioInputDevices()
			const selectables = mapAudioDevicesToSelectable(devices)
			setInputMediaDevices(selectables)
			setCurrentInputdevice(findDefaultMediaSource(selectables))

			if (canvasRef.current && socket) {
				const audioManagerInstance = new AudioManager(
					socket,
					canvasRef.current,
					findDefaultMediaSource(selectables).value
				)
				audioManagerInstance.audioContext.onstatechange = (e) => {
					if (e.currentTarget) {
						setIsAudioContextEnabled((e.currentTarget as AudioContext).state === 'running' ? true : false)
					}
				}
				audioManager.current = audioManagerInstance
			}
		}
		setAudioInputDevices()
	}, [isMounted, setIsAudioContextEnabled, setInputMediaDevices, setCurrentInputdevice])

	useEffect(() => {
		if (currentInputDevice) {
			audioManager.current?.setInputSource(currentInputDevice?.value)
		}
	}, [currentInputDevice])

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div>
				<Select
					options={inputMediaDevices}
					value={currentInputDevice}
					onChange={(selectable) => {
						setCurrentInputdevice(selectable)
					}}
				></Select>
				<canvas id="audio-frequency" ref={canvasRef} />
				{!isAudioContextEnabled && (
					<PromptInteractionOverlay>Please click to enable AudioContext.</PromptInteractionOverlay>
				)}
			</div>
		</>
	)
}

const PromptInteractionOverlay = styled.div`
	top: 0;
	position: absolute;
	height: 100%;
	width: 100%;
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const getStaticProps: GetStaticProps<OverlayPageProps> = async () => ({
	props: {
		title: 'Audio',
	},
})
;(AudioPage as PageWithLayoutType).layout = MainLayout

export default AudioPage
