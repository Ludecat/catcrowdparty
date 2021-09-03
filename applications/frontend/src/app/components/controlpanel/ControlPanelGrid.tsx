import React, { FunctionComponent, useState } from 'react'
import {
	MODERATOR_UPDATE,
	BALLON_UPDATE,
	CROWD_CROUCH,
	CROWD_IDLE,
	CROWD_MODE_UPDATE,
	CROWD_RUN,
	CROWD_UPDATE,
	HotAirBallonVationsValues,
	HOT_AIR_BALLON_START,
	IModeratorState,
	IBallonState,
	ICrowdState,
	CrowdMode,
} from '@ccp/common/shared'
import { useSocket } from '../../hooks/useSocket'
import { styled } from '../../styles/Theme'
import { Button } from '../Button'
import { CheckBoxToggle } from '../CheckBoxToggle'
import { TextArea } from '../TextArea'
import { GrUpdate } from 'react-icons/gr'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { longestWordCount } from '../../util/utils'
import { useEffect } from 'react'

const Grid = styled.div`
	display: grid;
	grid-gap: ${(p) => p.theme.space.xl}px;
	grid-template-columns: 300px 1fr;
	grid-auto-rows: auto;
	grid-template-areas:
		'header header'
		'crowd-control preview'
		'moderator-control preview'
		'layer-control preview'
		'triggers-control triggers-control';
`

const GridItem = styled.div<{ gridArea: string; height?: string; width?: string }>`
	color: ${(p) => p.theme.color.white};
	grid-area: ${(p) => p.gridArea};
	height: ${(p) => p.height ?? 'auto'};
	width: ${(p) => p.width ?? 'auto'};
`

const GridContentWrapper = styled.div`
	height: calc(100% - 19px); // automatically fill rest of the griditem by counting in heading height
	margin-top: ${(p) => p.theme.space.xs}px;
`
const GridItemHeading = styled.div`
	display: flex;
	align-items: center;
`

const GridItemTitle = styled.p`
	margin: 0;
	padding: 0;
	font-size: ${(p) => p.theme.fontSize.xl}px;
`

const Preview = styled.iframe`
	border: none;
	display: block;
	transform: scale(0.5);
	transform-origin: 0 0;
`

const ControlPanelHeading = styled.h1`
	margin: 0;
	padding: 0;
`

const GridItemHeadingActionsWrapper = styled.div`
	margin-left: ${(p) => p.theme.space.m}px;
	display: flex;
`

interface GridComponentProps {
	gridArea: string
	title: string
	height?: string
	width?: string
	actions?: React.ReactNode
}

const GridComponent: FunctionComponent<GridComponentProps> = (props) => {
	const { title, gridArea, height, width, actions } = props
	return (
		<GridItem gridArea={gridArea} height={height} width={width}>
			<GridItemHeading>
				<GridItemTitle>{title} </GridItemTitle>
				{actions && <GridItemHeadingActionsWrapper>{actions}</GridItemHeadingActionsWrapper>}
			</GridItemHeading>
			<GridContentWrapper>{props.children}</GridContentWrapper>
		</GridItem>
	)
}

interface Layers {
	[key: string]: boolean
}

const longestWordMaxThreshold = 15
const maxCharThreshold = 128
const maxLinesThreshold = 8

export const ControlPanelGrid = () => {
	const { socket } = useSocket()
	const [moderatorMessage, setModeratorMessage] = useState('')
	const [crowdMode, setCrowdMode] = useState<CrowdMode>(CrowdMode.manual)
	const [layersActive, setLayersActive] = useState<Layers>({
		'ccp-checkbox-air-ballon': true,
		'ccp-checkbox-moderator': true,
		'ccp-checkbox-crowd': true,
		'ccp-checkbox-emotes': true,
		'ccp-checkbox-speech-bubble': true,
	})

	const setCurrentLayer = useCallback(
		(e: React.FormEvent<HTMLInputElement>, isShown: boolean) => {
			setLayersActive({
				...layersActive,
				[e.currentTarget.value]: isShown,
			})
		},
		[layersActive, setLayersActive]
	)

	const onModeratorMessageChange = useCallback(
		(e: React.FormEvent<HTMLTextAreaElement>) => {
			if (longestWordCount(e.currentTarget.value) > longestWordMaxThreshold) {
				toast(`Longest word to long. Max ${longestWordMaxThreshold}.`, { type: 'info' })
				return
			}
			if (e.currentTarget.value.length > maxCharThreshold) {
				toast(`Too many characters. Max ${maxCharThreshold}.`, { type: 'info' })
				return
			}
			if (e.currentTarget.value.split('\n').length > maxLinesThreshold) {
				toast(`Too many lines. Max ${maxLinesThreshold}.`, { type: 'info' })
				return
			}
			setModeratorMessage(e.currentTarget.value)
		},
		[setModeratorMessage]
	)

	useEffect(() => {
		socket?.emit(CROWD_MODE_UPDATE, { mode: crowdMode })
	}, [crowdMode])

	const isDisabledManuelCrowdButton = !layersActive['ccp-checkbox-crowd'] || crowdMode === 'auto'
	return (
		<Grid>
			<GridItem gridArea={'header'}>
				<ControlPanelHeading>Cat Crowd Party - Control Panel</ControlPanelHeading>
			</GridItem>
			<GridComponent
				gridArea={'crowd-control'}
				title="Crowd Control"
				actions={
					<Button
						onClick={() => {
							setCrowdMode(crowdMode === CrowdMode.manual ? CrowdMode.auto : CrowdMode.auto)
						}}
					>
						{crowdMode}
					</Button>
				}
			>
				<Button onClick={() => socket?.emit(CROWD_IDLE)} value="CROWD_IDLE" disabled={isDisabledManuelCrowdButton}>
					Idle
				</Button>
				<Button onClick={() => socket?.emit(CROWD_CROUCH)} value="CROWD_CROUCH" disabled={isDisabledManuelCrowdButton}>
					Crouch
				</Button>
				<Button onClick={() => socket?.emit(CROWD_RUN)} value="CROWD_RUN" disabled={isDisabledManuelCrowdButton}>
					Run
				</Button>
			</GridComponent>
			<GridComponent
				gridArea={'moderator-control'}
				title="Moderator"
				actions={
					<Button
						disabled={!layersActive['ccp-checkbox-moderator']}
						onClick={() => {
							const updatedModeratorState: Partial<IModeratorState> = {
								message: moderatorMessage,
							}
							socket?.emit(MODERATOR_UPDATE, updatedModeratorState)
						}}
					>
						<GrUpdate size={16} />
					</Button>
				}
			>
				<TextArea onChange={onModeratorMessageChange} value={moderatorMessage} />
			</GridComponent>
			<GridComponent gridArea={'layer-control'} title="Layers">
				<CheckBoxToggle
					id="ccp-checkbox-air-ballon"
					value="ccp-checkbox-air-ballon"
					onChange={(e) => {
						let updatedBallonState: Partial<IBallonState>
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							updatedBallonState = {
								visibility: true,
							}
						} else {
							setCurrentLayer(e, false)
							updatedBallonState = {
								visibility: false,
							}
						}
						socket?.emit(BALLON_UPDATE, updatedBallonState)
					}}
					description="Air Ballon"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-moderator"
					value="ccp-checkbox-moderator"
					onChange={(e) => {
						let updatedModeratorState: Partial<IModeratorState>
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							updatedModeratorState = {
								message: moderatorMessage,
								visibility: true,
							}
						} else {
							setCurrentLayer(e, false)
							updatedModeratorState = {
								visibility: false,
							}
						}
						socket?.emit(MODERATOR_UPDATE, updatedModeratorState)
					}}
					description="Moderator"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-crowd"
					value="ccp-checkbox-crowd"
					onChange={(e) => {
						let updatedCrowdState: Partial<ICrowdState>
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							updatedCrowdState = {
								visibility: true,
							}
						} else {
							setCurrentLayer(e, false)
							updatedCrowdState = {
								visibility: false,
							}
						}
						socket?.emit(CROWD_UPDATE, updatedCrowdState)
					}}
					description="Crowd"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-emotes"
					value="ccp-checkbox-emotes"
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
						} else {
							setCurrentLayer(e, false)
						}
					}}
					description="Emotes"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-speech-bubble"
					value="ccp-checkbox-speech-bubble"
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
						} else {
							setCurrentLayer(e, false)
						}
					}}
					description="Twitch Speech Bubble"
				/>
			</GridComponent>
			<GridComponent gridArea={'preview'} title="Live View" height={'540px'} width={'960px'}>
				<Preview src="/overlay#small" height={1080} width={1920} />
			</GridComponent>
			<GridComponent gridArea={'triggers-control'} title="Triggers">
				<Button
					onClick={(e) => socket?.emit(HOT_AIR_BALLON_START, { variation: e.currentTarget.value })}
					disabled={!layersActive['ccp-checkbox-air-ballon']}
					value={HotAirBallonVationsValues.ludecat}
				>
					LudeCat Air Ballon
				</Button>
				<Button
					onClick={(e) => socket?.emit(HOT_AIR_BALLON_START, { variation: e.currentTarget.value })}
					disabled={!layersActive['ccp-checkbox-air-ballon']}
					value={HotAirBallonVationsValues.fritzCola}
				>
					Fritz Cola Ballon
				</Button>
				<Button
					onClick={(e) => socket?.emit(HOT_AIR_BALLON_START, { variation: e.currentTarget.value })}
					disabled={!layersActive['ccp-checkbox-air-ballon']}
					value={HotAirBallonVationsValues.fhSalzburg}
				>
					FH Ballon
				</Button>
			</GridComponent>
		</Grid>
	)
}
