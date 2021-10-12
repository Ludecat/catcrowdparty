import { SETTINGS_UPDATE, STATE_UPDATE } from '@ccp/common'
import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { styled } from '../../styles/Theme'

interface TwitchChannelInputProps {
	value?: string
}

const StyledInput = styled.input``
const Wrappper = styled.div``

export const TwitchChannelInput = ({ value }: TwitchChannelInputProps) => {
	const { socket } = useSocket()
	const [currentValue, setCurrentValue] = useState(value)

	const onInputChange = useCallback((e) => {
		setCurrentValue(e.target.value)
	}, [])

	useEffect(() => {
		socket?.on(STATE_UPDATE, (s) => {
			setCurrentValue(s.settings.twitchChannel ?? '')
		})
	}, [])

	const emitSettingsUpdateTwitchChannel = useCallback(() => {
		socket?.emit(SETTINGS_UPDATE, {
			twitchChannel: currentValue,
		})
	}, [socket, currentValue])

	return (
		<Wrappper>
			<StyledInput value={currentValue} onChange={onInputChange} />
			<button onClick={emitSettingsUpdateTwitchChannel}>Update</button>
		</Wrappper>
	)
}
