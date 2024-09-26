import { fetchMetadata } from 'frames.js/next'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createExampleURL } from './utils'
import { Frame } from './components/Frame'

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'frames.js starter example meta',
		description: 'This is a frames.js starter template',
		other: {
			...(await fetchMetadata(createExampleURL('/frames'))),
		},
	}
}

// This is a react server component only
export default async function Home() {

	return (
		<div className="flex flex-col max-w-[600px] w-full gap-2 mx-auto p-2">
			<div className="pb-4">
				Create a new frame
			</div>
		</div>
	)
}
