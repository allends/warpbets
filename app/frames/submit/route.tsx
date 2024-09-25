import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'
import { redirect } from 'frames.js/core'

export const frames = createFrames({
	basePath: '/frames',
	middleware: [
		farcasterHubContext({
			hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
})

export const POST = frames(async (ctx) => {

	if (!ctx.message?.isValid) {
		throw new Error('Invalid message')
	}

	const { message, searchParams } = ctx
	const outcome: string | undefined = searchParams?.['outcome']

	// send them back to the main page
	if (!message || !outcome) {
		return redirect('/?error=amount')
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
		return redirect('/', {
			headers: {
				'x-error': 'Please enter a valid amount',
			}
		})
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
