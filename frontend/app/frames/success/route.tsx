import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'

const frames = createFrames({
	basePath: '/frames',
	middleware: [
		farcasterHubContext({
			hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
})

export const POST = frames(async (ctx) => {
	console.log(ctx)

	const { message, searchParams } = ctx
	const outcome: string | undefined = searchParams?.['outcome']

	if (!message || !outcome) {
		return {
			image: <div>Make a prediction!</div>,
			buttons: [
				<Button key="button" action="post">
					Cool
				</Button>,
			],
		}
	}

	const { inputText, requesterUserData } = message

	if (!requesterUserData) {
		return {
			image: <div>Please login to make a prediction</div>,
			buttons: [
				<Button key="button" action="post">
					Fine
				</Button>,
			],
		}
	}

	const amount = parseFloat(inputText ?? '')

	if (isNaN(amount)) {
		return {
			image: <div>Please enter a valid amount</div>,
			buttons: [
				<Button key="button" action="post">
					OK
				</Button>,
			],
		}
	}

	return {
		image: (
			<div tw="flex flex-col">
				{requesterUserData.displayName} bet {amount} on {outcome}
			</div>
		),
		buttons: [
			<Button key="button" action="post">
				Cool
			</Button>,
		],
	}
})
