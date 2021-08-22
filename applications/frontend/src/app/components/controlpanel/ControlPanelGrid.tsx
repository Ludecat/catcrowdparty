import React, { FunctionComponent } from 'react'
import { CROWD_CROUCH, CROWD_IDLE, CROWD_RUN } from '@ccp/common/shared'
import { useSocket } from '../../hooks/useSocket'
import { styled } from '../../styles/Theme'
import { Button } from '../Button'
import { CheckBoxToggle } from '../CheckBoxToggle'
import { TextArea } from '../TextArea'

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
const GridItemHeading = styled.p`
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

interface GridComponentProps {
	gridArea: string
	title: string
	height?: string
	width?: string
}

const GridComponent: FunctionComponent<GridComponentProps> = (props) => {
	const { title, gridArea, height, width } = props
	return (
		<GridItem gridArea={gridArea} height={height} width={width}>
			<GridItemHeading>{title}</GridItemHeading>
			<GridContentWrapper>{props.children}</GridContentWrapper>
		</GridItem>
	)
}

export const ControlPanelGrid = () => {
	const { socket } = useSocket()

	return (
		<Grid>
			<GridItem gridArea={'header'}>
				<ControlPanelHeading>Cat Crowd Party - Control Panel</ControlPanelHeading>
			</GridItem>
			<GridComponent gridArea={'crowd-control'} title="Crowd Control">
				<Button onClick={() => socket?.emit(CROWD_IDLE)} value="CROWD_IDLE" title="Idle"></Button>
				<Button onClick={() => socket?.emit(CROWD_CROUCH)} value="CROWD_CROUCH" title="Crouch"></Button>
				<Button onClick={() => socket?.emit(CROWD_RUN)} value="CROWD_RUN" title="Run"></Button>
			</GridComponent>
			<GridComponent gridArea={'moderator-control'} title="Moderator">
				<TextArea onChange={(e) => console.log(e.currentTarget.value)} />
			</GridComponent>
			<GridComponent gridArea={'layer-control'} title="Layers">
				<CheckBoxToggle
					id="ccp-checkbox-air-ballon"
					onChange={(e) => console.log(e.currentTarget.checked)}
					description="Air Ballon"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-moderator"
					onChange={(e) => console.log(e.currentTarget.checked)}
					description="Moderator"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-crowd"
					onChange={(e) => console.log(e.currentTarget.checked)}
					description="Crowd"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-emotes"
					onChange={(e) => console.log(e.currentTarget.checked)}
					description="Emotes"
				/>
				<CheckBoxToggle
					id="ccp-checkbox-speech-bubble"
					onChange={(e) => console.log(e.currentTarget.checked)}
					description="Twitch Speech Bubble"
				/>
			</GridComponent>
			<GridComponent gridArea={'preview'} title="Preview" height={'540px'} width={'960px'}>
				<Preview src="/overlay#small" height={1080} width={1920} />
			</GridComponent>
			<GridComponent gridArea={'triggers-control'} title="Triggers">
				<Button
					onClick={(e) => console.log(e.currentTarget.value)}
					value="LudeCat Air Ballon"
					title="LudeCat Air Ballon"
				></Button>
				<Button
					onClick={(e) => console.log(e.currentTarget.value)}
					value="Fritz Cola Ballon"
					title="Fritz Cola Ballon"
				></Button>
				<Button onClick={(e) => console.log(e.currentTarget.value)} value="FH Ballon" title="FH Ballon"></Button>
			</GridComponent>
		</Grid>
	)
}
