import React, { useEffect, useState, useCallback } from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import MainLayout from '../../app/layout/Layout'
import PageWithLayoutType from '../../app/layout/PageWithLayout'
import { AudioManager } from '../../app/audio/AudioManager'
import Select from 'react-select'

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

const AudioPage: NextPage<OverlayPageProps> = (props: OverlayPageProps) => {
	const { title } = props

	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
	const audioManager = React.useRef<AudioManager | null>(null)

	const [inputMediaDevices, setInputMediaDevices] = useState<Selectable[]>([])
	const [currentInputDevice, setCurrentInputdevice] = useState<Selectable | null>(null)

	const getAudioInputDevices = useCallback(async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices()
		return mediaDevices.filter((device) => device.kind === 'audioinput')
	}, [])

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.style.height = 'calc(100vh - 43px)'
			canvasRef.current.style.width = '100vw'
		}
	}, [])

	useEffect(() => {
		const setAudioInputDevices = async () => {
			const devices = await getAudioInputDevices()
			const selectables = mapAudioDevicesToSelectable(devices)
			setInputMediaDevices(selectables)
			setCurrentInputdevice(findDefaultMediaSource(selectables))
			audioManager.current = new AudioManager(canvasRef.current!, findDefaultMediaSource(selectables).value)
		}
		setAudioInputDevices()
	}, [])

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
			</div>
		</>
	)
}

export const getStaticProps: GetStaticProps<OverlayPageProps> = async () => ({
	props: {
		title: 'Audio',
	},
})
;(AudioPage as PageWithLayoutType).layout = MainLayout

export default AudioPage
