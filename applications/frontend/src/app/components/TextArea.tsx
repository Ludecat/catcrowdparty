import React from 'react'
import { styled } from '../styles/Theme'

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
	value?: string
}

const StyledTextArea = styled.textarea<{ height: string; width: string }>`
	background: ${(p) => p.theme.color.white};
	color: ${(p) => p.theme.color.blackPeral};
	font-size: ${(p) => p.theme.fontSize.m}px;
	width: ${(p) => p.width};
	height: ${(p) => p.height};

	padding: ${(p) => p.theme.space.s}px;
	border-radius: 3px;
	caret-color: ${(p) => p.theme.color.blackPeral};
	background: url('/ccp_speechbubble_small_left.png');
	background-size: c;
	background-size: 288px;
	background-repeat: no-repeat;
	border: none;
	padding-right: 42px;
	text-align: center;
	padding-left: 42px;
	padding-top: 8px;
	padding-bottom: 125px;
	overflow: hidden;
	transform: scale(0.8);
	resize: none;
`

export const TextArea = ({ value, ...props }: TextAreaProps) => {
	return <StyledTextArea {...props} value={value} rows={6} width={'288px'} height={'288px'}></StyledTextArea>
}
