import React from 'react'
import { createContext, FunctionComponent, useState } from 'react'
import { GlobalState } from '@ccp/common/shared'

export interface GlobalStateContextState {
	globalState: GlobalState | null
	setGlobalState: React.Dispatch<React.SetStateAction<GlobalState | null>>
}

const globalStateDefaultValue: GlobalStateContextState = {
	globalState: null,
	setGlobalState: () => {
		return
	},
}

export const GlobalStateContext = createContext<GlobalStateContextState>(globalStateDefaultValue)
export const GlobalStateProvider: FunctionComponent = ({ children }) => {
	const [globalState, setGlobalState] = useState<GlobalState | null>(globalStateDefaultValue.globalState)

	return (
		<GlobalStateContext.Provider
			value={{
				globalState,
				setGlobalState,
			}}
		>
			{children}
		</GlobalStateContext.Provider>
	)
}
