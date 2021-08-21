import React from 'react'
import { styled } from '../styles/Theme'

interface CheckBoxProps extends React.HTMLAttributes<HTMLInputElement> {
	value?: string
}

/**
 * Inspired by https://codesandbox.io/s/6v7n1vr8yn?file=/src/index.js
 */
export const CheckBoxToggle = ({ ...props }: CheckBoxProps) => {
	return (
		<CheckBoxWrapper>
			<CheckBox {...props} type="checkbox" />
			<CheckBoxLabel htmlFor={props.id} />
		</CheckBoxWrapper>
	)
}

const CheckBoxWrapper = styled.div`
	position: relative;
`
const CheckBoxLabel = styled.label`
	position: absolute;
	top: 0;
	left: 0;
	width: 42px;
	height: 26px;
	border-radius: 15px;
	background: ${(p) => p.theme.color.decentBeton};
	cursor: pointer;
	&::after {
		content: '';
		display: block;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		margin: 3px;
		background: ${(p) => p.theme.color.white};
		box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
		transition: 0.2s;
	}
`
const CheckBox = styled.input`
	opacity: 0;
	z-index: 1;
	border-radius: 15px;
	width: 42px;
	height: 26px;
	&:checked + ${CheckBoxLabel} {
		background: ${(p) => p.theme.color.ludecatyellow};
		&::after {
			content: '';
			display: block;
			border-radius: 50%;
			width: 18px;
			height: 18px;
			margin-left: 21px;
			transition: 0.2s;
		}
	}
`
