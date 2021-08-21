import React from 'react'
import dynamic from 'next/dynamic'

/**
 * We do not want to run phaser on the server-side.
 * https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 */
const DynamicPhaserGame = dynamic(() => import('./PhaserGame'), { ssr: false })

export const Overlay = () => {
	return (
		<div>
			<DynamicPhaserGame />
		</div>
	)
}
