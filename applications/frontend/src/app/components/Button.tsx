import React from 'react'
import { styled } from '../styles/Theme'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	value?: string
}

const StyledButton = styled.button`
	background: ${(p) => p.theme.color.ludecatyellow};
	color: ${(p) => p.theme.color.blackPeral};
	border: 2px solid ${(p) => p.theme.color.ludecatyellow};

	font-size: ${(p) => p.theme.fontSize.l}px;

	margin-right: ${(p) => p.theme.space.l}px;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.m}px;
	cursor: pointer;
	border-radius: 3px;
	transition: all 0.12s;

	&:hover {
		background: ${(p) => p.theme.color.white};
	}
`

export const Button = ({ title, children, value, ...props }: ButtonProps) => {
	return (
		<StyledButton type="button" {...props} value={value}>
			{children}
		</StyledButton>
	)
}
