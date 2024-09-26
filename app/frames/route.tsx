/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from './frames'
import { z } from 'zod'

const searchParamsSchema = z.object({
	frameId: z.string().optional(),
})

const ctxSchema = z.object({
	searchParams: searchParamsSchema,
})

const frameHandler = frames(async (ctx) => {
	return {
		image: (
			<div tw="flex flex-col items-center justify-center w-full h-full">
				<div
					tw="mb-4 text-blue-500"
					style={{
						fontFamily: "'Ankh Sanctuary', sans-serif",
						fontWeight: 700,
						fontSize: '10rem',
					}}
				>
					WARPBETS
				</div>
				<div>take on the odds...</div>
			</div>
		),
		buttons: [
			<Button
				action="post"
				target={{
					pathname: '/default',
				}}
			>
				{`I'm in!`}
			</Button>,
		],
	}
})

export const GET = frameHandler
export const POST = frameHandler
