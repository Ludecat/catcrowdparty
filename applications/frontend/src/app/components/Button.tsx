import React from 'react'
import { styled } from '../styles/Theme'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	value?: string
	disabled?: boolean
	isActive?: boolean
}

const StyledButton = styled.button<{ isActive?: boolean }>`
	background: ${(p) => p.theme.color.ludecatyellow};
	color: ${(p) => p.theme.color.blackPeral};
	border: 2px solid ${(p) => p.theme.color.ludecatyellow};

	font-size: ${(p) => p.theme.fontSize.l}px;

	margin-right: ${(p) => p.theme.space.s}px;
	margin-top: ${(p) => p.theme.space.s}px;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.m}px;
	cursor: pointer;
	border-radius: 3px;
	transition: all 0.12s;
	box-shadow: 0px 0px 0px 2px ${(p) => (p.isActive ? p.theme.color.white : 'transparent')};

	&:hover {
		background: ${(p) => p.theme.color.white};
	}

	&:disabled {
		background: ${(p) => p.theme.color.disabled};
		border-color: ${(p) => p.theme.color.disabled};

		&:hover {
			background: ${(p) => p.theme.color.disabled};
			border-color: ${(p) => p.theme.color.disabled};
			cursor: default;
		}
	}
`

export const Button = ({ children, value, disabled, isActive, ...props }: ButtonProps) => {
	return (
		<StyledButton type="button" {...props} value={value} disabled={disabled} isActive={isActive}>
			{children}
		</StyledButton>
	)
}
