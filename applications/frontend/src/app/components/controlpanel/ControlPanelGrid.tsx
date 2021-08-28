import React, { FunctionComponent, useState } from 'react'
import {
	CROWD_CROUCH,
	CROWD_HIDE,
	CROWD_IDLE,
	CROWD_RUN,
	CROWD_SHOW,
	HotAirBallonVationsValues,
	HOT_AIR_BALLON_HIDE,
	HOT_AIR_BALLON_SHOW,
	HOT_AIR_BALLON_START,
	MODERATOR_HIDE,
	MODERATOR_MESSAGE_UPDATE,
	MODERATOR_SHOW,
} from '@ccp/common/shared'
import { useSocket } from '../../hooks/useSocket'
import { styled } from '../../styles/Theme'
import { Button } from '../Button'
import { CheckBoxToggle } from '../CheckBoxToggle'
import { TextArea } from '../TextArea'
import { GrUpdate } from 'react-icons/gr'
import { useCallback } from 'react'

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

export const ControlPanelGrid = () => {
	const { socket } = useSocket()
	const [moderatorMessage, setModeratorMessage] = useState('')
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

	return (
		<Grid>
			<GridItem gridArea={'header'}>
				<ControlPanelHeading>Cat Crowd Party - Control Panel</ControlPanelHeading>
			</GridItem>
			<GridComponent gridArea={'crowd-control'} title="Crowd Control">
				<Button
					onClick={() => socket?.emit(CROWD_IDLE)}
					value="CROWD_IDLE"
					disabled={!layersActive['ccp-checkbox-crowd']}
				>
					Idle
				</Button>
				<Button
					onClick={() => socket?.emit(CROWD_CROUCH)}
					value="CROWD_CROUCH"
					disabled={!layersActive['ccp-checkbox-crowd']}
				>
					Crouch
				</Button>
				<Button
					onClick={() => socket?.emit(CROWD_RUN)}
					value="CROWD_RUN"
					disabled={!layersActive['ccp-checkbox-crowd']}
				>
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
							socket?.emit(MODERATOR_MESSAGE_UPDATE, { message: moderatorMessage })
						}}
					>
						<GrUpdate size={16} />
					</Button>
				}
			>
				<TextArea onChange={(e) => setModeratorMessage(e.currentTarget.value)} />
			</GridComponent>
			<GridComponent gridArea={'layer-control'} title="Layers">
				<CheckBoxToggle
					id="ccp-checkbox-air-ballon"
					value="ccp-checkbox-air-ballon"
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							socket?.emit(HOT_AIR_BALLON_SHOW)
						} else {
							setCurrentLayer(e, false)
							socket?.emit(HOT_AIR_BALLON_HIDE)
						}
					}}
					description="Air Ballon"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-moderator"
					value="ccp-checkbox-moderator"
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							socket?.emit(MODERATOR_SHOW, { message: moderatorMessage })
						} else {
							setCurrentLayer(e, false)
							socket?.emit(MODERATOR_HIDE)
						}
					}}
					description="Moderator"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-crowd"
					value="ccp-checkbox-crowd"
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setCurrentLayer(e, true)
							socket?.emit(CROWD_SHOW)
						} else {
							setCurrentLayer(e, false)
							socket?.emit(CROWD_HIDE)
						}
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
