import React from 'react'
import dynamic from 'next/dynamic'
import { useGlobalState } from '../hooks/useGlobalState'

/**
 * We do not want to run phaser on the server-side.
 * https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 */
const DynamicPhaserGame = dynamic(() => import('./PhaserGame'), { ssr: false })

export const Overlay = () => {
	const { globalState } = useGlobalState()
	return <div>{globalState && <DynamicPhaserGame />}</div>
}
