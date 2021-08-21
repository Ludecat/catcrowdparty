import React from 'react'
import { styled } from '../styles/Theme'

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
	value?: string
}

const StyledTextArea = styled.textarea`
	background: ${(p) => p.theme.color.white};
	color: ${(p) => p.theme.color.blackPeral};
	border: 2px solid ${(p) => p.theme.color.ludecatyellow};
	font-size: ${(p) => p.theme.fontSize.l}px;

	margin: ${(p) => p.theme.space.xs}px;
	padding: ${(p) => p.theme.space.s}px;
	border-radius: 3px;
	caret-color: ${(p) => p.theme.color.blackPeral};
`

export const TextArea = ({ children, value, ...props }: TextAreaProps) => {
	return <StyledTextArea {...props} value={value} rows={2}></StyledTextArea>
}
