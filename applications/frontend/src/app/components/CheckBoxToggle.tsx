import React from 'react'
import { styled } from '../styles/Theme'

interface CheckBoxProps extends React.HTMLAttributes<HTMLInputElement> {
	value?: string
	checked: boolean
	description?: string
}

/**
 * Inspired by https://codesandbox.io/s/6v7n1vr8yn?file=/src/index.js
 */
export const CheckBoxToggle = ({ description, checked, ...props }: CheckBoxProps) => {
	return (
		<CheckBoxWrapper>
			<CheckBox {...props} type="checkbox" checked={checked} />
			<CheckBoxLabel htmlFor={props.id} />
			<CheckBoxDescription>{description}</CheckBoxDescription>
		</CheckBoxWrapper>
	)
}

const CheckBoxDescription = styled.p`
	position: absolute;
	right: 20%;
	top: 3px;
`

const CheckBoxWrapper = styled.div`
	width: 100%;
	position: relative;
	height: 24px;
	margin: 12px 0;
`
const CheckBoxLabel = styled.label`
	position: absolute;
	top: 0;
	left: 0;
	width: 42px;
	border-radius: 15px;
	background: ${(p) => p.theme.color.decentBeton};
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
	height: 24px;
	margin: 0;
	position: absolute;
	cursor: pointer;
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
