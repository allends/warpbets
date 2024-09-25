import { Button } from 'frames.js/next'
import { frames } from '../frames'

const frameHandler = frames(async (ctx) => {

	if (!ctx.message?.isValid) {
		throw new Error('Invalid message')
	}

	const user = ctx.message.requesterUserData

	return {
		image: (
			<div tw="flex flex-col">
				<div tw="flex">
					Okay {user?.displayName}, lets make a bet...
				</div>
				<div tw="flex">
					There will be over 10,000 Kramer predictions before 9/29
					midnight
				</div>
			</div>
		),
		textInput: 'Enter amount',
		buttons: [
			<Button
				key="yes"
				action="post"
				target={{ pathname: '/submit', query: { outcome: 'yes' } }}
			>
				Yes
			</Button>,
			<Button
				key="no"
				action="post"
				target={{ pathname: '/submit', query: { outcome: 'no' } }}
			>
				No
			</Button>,
		],
	}
})

export const GET = frameHandler
export const POST = frameHandler
