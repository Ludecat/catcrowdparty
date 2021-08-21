import React, { FunctionComponent } from 'react'
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

const GridItem = styled.div<{ gridArea: string }>`
	color: ${(p) => p.theme.color.white};
	grid-area: ${(p) => p.gridArea};
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

const Preview = styled.div`
	height: 100%;
	background-color: ${(p) => p.theme.color.decentBeton};
`

const ControlPanelHeading = styled.h1`
	margin: 0;
	padding: 0;
`

interface GridComponentProps {
	gridArea: string
	title: string
}

const GridComponent: FunctionComponent<GridComponentProps> = (props) => {
	const { title, gridArea } = props
	return (
		<GridItem gridArea={gridArea}>
			<GridItemHeading>{title}</GridItemHeading>
			<GridContentWrapper>{props.children}</GridContentWrapper>
		</GridItem>
	)
}

export const ControlPanelGrid = () => {
	return (
		<Grid>
			<GridItem gridArea={'header'}>
				<ControlPanelHeading>Cat Crowd Party - Control Panel</ControlPanelHeading>
			</GridItem>
			<GridComponent gridArea={'crowd-control'} title="Crowd Control">
				<Button onClick={(e) => console.log(e.currentTarget.value)} value="Idle" title="Idle"></Button>
				<Button onClick={(e) => console.log(e.currentTarget.value)} value="Clap" title="Clap"></Button>
				<Button onClick={(e) => console.log(e.currentTarget.value)} value="Party" title="Party"></Button>
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
			<GridComponent gridArea={'preview'} title="Preview">
				<Preview />
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
