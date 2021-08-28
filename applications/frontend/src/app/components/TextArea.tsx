import React from 'react'
import { styled } from '../styles/Theme'

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
	value?: string
}

const StyledTextArea = styled.textarea<{ height: string; width: string }>`
	background: ${(p) => p.theme.color.white};
	color: ${(p) => p.theme.color.blackPeral};
	font-size: ${(p) => p.theme.fontSize.l}px;
	width: ${(p) => p.width};
	height: ${(p) => p.height};

	padding: ${(p) => p.theme.space.s}px;
	border-radius: 3px;
	caret-color: ${(p) => p.theme.color.blackPeral};
`

export const TextArea = ({ children, value, ...props }: TextAreaProps) => {
	return <StyledTextArea {...props} value={value} rows={6} width={'300px'} height={'200px'}></StyledTextArea>
}
