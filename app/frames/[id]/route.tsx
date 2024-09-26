import { Button } from 'frames.js/next'
import { frames } from '../frames'
import FrameService from '../../db/frame'
import { z } from 'zod'
import { userSchema } from '../../utils/parsers'
import { url } from 'inspector'

const ctxSchema = z.object({
	message: z
		.object({
			requesterUserData: userSchema,
		})
		.optional(),
	url: z.object({
		pathname: z.string(),
	}),
})

const frameHandler = frames(async (ctx) => {
	console.log(ctx)

	const result = ctxSchema.safeParse(ctx)

	if (result.success === false) {
		throw new Error('Invalid Context Input')
	}

	const frameId = result.data.url.pathname.split('/')[2]?.trim()

	let frame = await FrameService.getFrame(frameId || 'default')

	if (!frame && frameId === 'default') {
		frame = await FrameService.createFrame({
			id: 'default',
			label: 'There will be over 10,000 Kramer predictions before 9/29 midnight?',
			optionA: 'Yes',
			optionB: 'No',
			expiration: new Date('9/29/2021 23:59:59').getTime(),
		})
	}

	if (!frame) {
		return {
			image: (
				<div tw="flex flex-row w-4/5 h-4/5 justify-between items-end relative">
					<div>
						{`These are not the droids you're looking for...`}
					</div>
				</div>
			),
			buttons: [
				<Button
					key="return"
					action="post"
					target={{
						pathname: '/',
					}}
				>
					Lets go back...
				</Button>,
			],
		}
	}

	const user = result.data.message?.requesterUserData

	return {
		image: (
			<div tw="h-4/5 w-4/5 flex flex-col justify-between gap-4">
				<div tw="flex flex-col items-start">
					<div
						tw="flex text-left text-blue-500"
						style={{
							fontFamily: 'Ankh Sanctuary',
							fontSize: '8rem',
						}}
					>
						{user ? user.displayName : 'Anon'},
					</div>

					<div>how much will you wager that</div>
				</div>
				<div
					tw="flex mt-5"
					style={{
						fontFamily: 'Inter',
						fontWeight: 700,
					}}
				>
					{frame.label}
				</div>
			</div>
		),
		textInput: 'Enter amount',
		buttons: [
			<Button
				key="yes"
				action="post"
				target={{
					pathname: '/submit',
					query: { option: 'a', frameId: frame.id },
				}}
			>
				{frame.optionA}
			</Button>,
			<Button
				key="no"
				action="post"
				target={{
					pathname: '/submit',
					query: { option: 'b', frameId: frame.id },
				}}
			>
				{frame.optionB}
			</Button>,
		],
	}
})

export const GET = frameHandler
export const POST = frameHandler
