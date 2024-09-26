import { Button } from 'frames.js/next'
import { frames } from '../frames'
import FrameService from '../../db/frame'

const frameHandler = frames(async (ctx) => {

	if (!ctx.message?.isValid) {
		throw new Error('Invalid message')
	}

	let frame = await FrameService.getFrame('default')

	if (!frame) {
		frame = await FrameService.createFrame({
			id: 'default',
			label: 'There will be over 10,000 Kramer predictions before 9/29 midnight?',
			optionA: 'Yes',
			optionB: 'No',
			expiration: (new Date('9/29/2021 23:59:59')).getTime(),
		})
	}

	if (!frame) {
		throw new Error('Could not create default game')
	}

	const user = ctx.message.requesterUserData

	return {
		image: (
			<div tw="h-4/5 w-4/5 flex flex-col justify-between gap-4">
				<div tw="flex flex-col items-start">
					<div tw="flex text-left text-blue-500" style={{
						fontFamily: 'Ankh Sanctuary',
						fontSize: "8rem",
					}}>
						{user?.displayName},
					</div>
					<div>
						how much will you wager that
					</div>
				</div>
				<div tw="flex mt-5" style={{
					fontFamily: "Inter",
					fontWeight: 700
				}}>
					{frame.label}
				</div>
			</div>
		),
		textInput: 'Enter amount',
		buttons: [
			<Button
				key="yes"
				action="post"
				target={{ pathname: '/submit', query: { option: 'a', frameId: frame.id } }}
			>
				{frame.optionA}
			</Button>,
			<Button
				key="no"
				action="post"
				target={{ pathname: '/submit', query: { option: 'b', frameId: frame.id } }}
			>
				{frame.optionB}
			</Button>,
		],
	}
})

export const GET = frameHandler
export const POST = frameHandler
