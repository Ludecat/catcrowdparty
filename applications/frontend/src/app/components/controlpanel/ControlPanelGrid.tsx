import React, { FunctionComponent, useState } from 'react'
import {
	MODERATOR_UPDATE,
	HOT_AIR_BALLOON_UPDATE,
	CROWD_UPDATE,
	HotAirBalloonVationsValues,
	HOT_AIR_BALLOON_START,
	ModeratorState,
	CrowdMode,
	GlobalState,
	EMOTES_UPDATE,
	BUBBLES_UPDATE,
	HotAirBalloonVariationsType,
	isIdleState,
	isJumpState,
	isPartyState,
	SETTINGS_UPDATE,
	ZeppelinVariationValues,
	ZEPPELIN_UPDATE,
	ZEPPELIN_START,
	ZeppelinVariationType,
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
import { Range, getTrackBackground } from 'react-range'

const Grid = styled.div`
	display: grid;
	grid-gap: ${(p) => p.theme.space.xl}px;
	grid-template-columns: 300px 1fr;
	grid-auto-rows: auto 290px auto auto auto;
	grid-template-areas:
		'crowd-control preview'
		'moderator-control preview'
		'layer-control preview'
		'triggers-control zeppelin-control';
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

const longestWordMaxThreshold = 15
const maxCharThreshold = 128
const maxLinesThreshold = 6

const STEP = 5
const MIN = 0
const MAX = 255
const COLORS = ['#8b7211', '#FFCC00', '#ccc']

export const ControlPanelGrid: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const { socket } = useSocket()
	const [moderatorMessage, setModeratorMessage] = useState(globalState.moderator.message)

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

	const setAndEmitCrowdMode = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const newCrowdMode = e.currentTarget.value === CrowdMode.manual ? CrowdMode.auto : CrowdMode.manual
			socket?.emit(CROWD_UPDATE, {
				mode: newCrowdMode,
			})
		},
		[socket]
	)

	const setAndEmitCrowdIntensity = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			socket?.emit(CROWD_UPDATE, {
				intensity: parseInt(e.currentTarget.value, 10),
			})
		},
		[socket]
	)

	const setAndEmitModeratorMessage = useCallback(() => {
		socket?.emit(MODERATOR_UPDATE, {
			message: moderatorMessage,
		})
	}, [socket, moderatorMessage])

	const setAndEmitModeratorVisilibity = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			let updatedModeratorState: Partial<ModeratorState>
			if (e.currentTarget.checked) {
				updatedModeratorState = {
					message: moderatorMessage,
					visibility: true,
				}
			} else {
				updatedModeratorState = {
					visibility: false,
				}
			}
			socket?.emit(MODERATOR_UPDATE, updatedModeratorState)
		},
		[socket, moderatorMessage]
	)

	const setAndEmitHotAirBalloonVisibility = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			socket?.emit(HOT_AIR_BALLOON_UPDATE, {
				visibility: e.currentTarget.checked,
			})
		},
		[socket]
	)

	const setAndEmitCrowdVisilibity = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			socket?.emit(CROWD_UPDATE, {
				visibility: e.currentTarget.checked,
			})
		},
		[socket]
	)

	const setAndEmitEmotesVisibility = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			socket?.emit(EMOTES_UPDATE, {
				visibility: e.currentTarget.checked,
			})
		},
		[socket]
	)

	const setAndEmitBubblesVisibility = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			socket?.emit(BUBBLES_UPDATE, {
				visibility: e.currentTarget.checked,
			})
		},
		[socket]
	)

	const setAndEmitZeppelinVisibility = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			socket?.emit(ZEPPELIN_UPDATE, {
				visibility: e.currentTarget.checked,
			})
		},
		[socket]
	)

	const setAndEmitBalloonTrigger = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			socket?.emit(HOT_AIR_BALLOON_START, { variation: e.currentTarget.value as HotAirBalloonVariationsType })
		},
		[socket]
	)

	const setAndEmitZeppelinTrigger = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			socket?.emit(ZEPPELIN_START, { variation: e.currentTarget.value as ZeppelinVariationType })
		},
		[socket]
	)

	const setAndEmitSettingsTrigger = useCallback(
		(threshold: number[]) => {
			socket?.emit(SETTINGS_UPDATE, { crowdThreshold: threshold })
		},
		[socket]
	)

	const isDisabledManualCrowdButton = !globalState.crowd.visibility || globalState?.crowd.mode === 'auto'
	return (
		<Grid>
			<GridComponent
				gridArea={'crowd-control'}
				title="Crowd"
				actions={
					<Button
						value={globalState?.crowd.mode}
						onClick={setAndEmitCrowdMode}
						style={{
							padding: '4px',
							fontSize: '12px',
						}}
					>
						mode: {globalState?.crowd.mode}
					</Button>
				}
			>
				<Button
					onClick={setAndEmitCrowdIntensity}
					value={'0'}
					disabled={isDisabledManualCrowdButton}
					isActive={isIdleState(globalState.crowd.intensity, globalState.settings.crowdThreshold)}
				>
					idle
				</Button>
				<Button
					onClick={setAndEmitCrowdIntensity}
					value={`${globalState.settings.crowdThreshold[0]}`}
					disabled={isDisabledManualCrowdButton}
					isActive={isJumpState(globalState.crowd.intensity, globalState.settings.crowdThreshold)}
				>
					jump
				</Button>
				<Button
					onClick={setAndEmitCrowdIntensity}
					value={`${globalState.settings.crowdThreshold[1]}`}
					disabled={isDisabledManualCrowdButton}
					isActive={isPartyState(globalState.crowd.intensity, globalState.settings.crowdThreshold)}
				>
					party
				</Button>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Range
						values={globalState.settings.crowdThreshold}
						step={STEP}
						min={MIN}
						max={MAX}
						onChange={(values) => setAndEmitSettingsTrigger(values)}
						renderTrack={({ props, children }) => (
							<div
								role="button"
								tabIndex={-1}
								/* eslint-disable react/prop-types */
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '56px',
									display: 'flex',
									width: '100%',
								}}
							>
								<div
									/* eslint-disable react/prop-types */
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '2px',
										background: getTrackBackground({
											values: globalState.settings.crowdThreshold,
											colors: COLORS,
											min: MIN,
											max: MAX,
										}),
										alignSelf: 'center',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props, isDragged, index }) => (
							<div
								{...props}
								style={{
									/* eslint-disable react/prop-types */
									...props.style,
									height: '24px',
									width: '24px',
									borderRadius: '4px',
									backgroundColor: '#FFF',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										position: 'absolute',
										bottom: '-21px',
										color: 'black',
										fontWeight: 600,
										fontSize: '12px',
										padding: '2px 4px',
										borderRadius: '4px',
										backgroundColor: '#FFCC00',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										lineHeight: 1,
									}}
								>
									{globalState.settings.crowdThreshold[index]}
								</div>
								<div
									style={{
										height: '16px',
										width: '4px',
										backgroundColor: isDragged ? '#FFCC00' : '#CCC',
									}}
								/>
							</div>
						)}
					/>
				</div>
			</GridComponent>
			<GridComponent
				gridArea={'moderator-control'}
				title="Moderator"
				actions={
					<Button onClick={setAndEmitModeratorMessage}>
						<GrUpdate size={16} />
					</Button>
				}
			>
				<TextArea onChange={onModeratorMessageChange} value={moderatorMessage} />
			</GridComponent>

			<GridComponent gridArea={'layer-control'} title="Layers">
				<CheckBoxToggle
					checked={globalState.hotAirballoon.visibility}
					onClick={setAndEmitHotAirBalloonVisibility}
					description="Air Balloon"
				/>
				<CheckBoxToggle
					checked={globalState.moderator.visibility}
					onChange={setAndEmitModeratorVisilibity}
					description="Moderator"
				/>
				<CheckBoxToggle
					checked={globalState.crowd.visibility}
					onChange={setAndEmitCrowdVisilibity}
					description="Crowd"
				/>
				<CheckBoxToggle
					checked={globalState.emotes.visibility}
					onChange={setAndEmitEmotesVisibility}
					description="Emotes"
				/>
				<CheckBoxToggle
					checked={globalState.bubbles.visibility}
					onChange={setAndEmitBubblesVisibility}
					description="Twitch Speech Bubble"
				/>
				<CheckBoxToggle
					checked={globalState.zeppelin.visibility}
					onChange={setAndEmitZeppelinVisibility}
					description="Zeppelin"
				/>
			</GridComponent>
			<GridComponent gridArea={'preview'} title="Live View" height={'540px'} width={'960px'}>
				<Preview src="/overlay#small" height={1080} width={1920} />
			</GridComponent>
			<GridComponent gridArea={'triggers-control'} title="Balloons">
				<Button
					onClick={setAndEmitBalloonTrigger}
					disabled={!globalState.hotAirballoon.visibility}
					value={HotAirBalloonVationsValues.ludecat}
				>
					Yellow
				</Button>
				<Button
					onClick={setAndEmitBalloonTrigger}
					disabled={!globalState.hotAirballoon.visibility}
					value={HotAirBalloonVationsValues.fritzCola}
				>
					Red
				</Button>
				<Button
					onClick={setAndEmitBalloonTrigger}
					disabled={!globalState.hotAirballoon.visibility}
					value={HotAirBalloonVationsValues.fhSalzburg}
				>
					Green
				</Button>
			</GridComponent>
			<GridComponent gridArea={'zeppelin-control'} title="Zeppelins">
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.razer}
				>
					Razer
				</Button>
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.willhaben}
				>
					willhaben
				</Button>
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.ubisoft}
				>
					Ubisoft
				</Button>
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.akSalzburg}
				>
					AK Salzburg
				</Button>
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.fritzKola}
				>
					Fritz Cola
				</Button>
				<Button
					onClick={setAndEmitZeppelinTrigger}
					disabled={!globalState.zeppelin.visibility}
					value={ZeppelinVariationValues.nerdic}
				>
					Nerdic
				</Button>
			</GridComponent>
		</Grid>
	)
}
