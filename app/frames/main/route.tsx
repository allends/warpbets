import { Button } from 'frames.js/next'
import { frames } from '../frames'

const frameHandler = frames(async (ctx) => {

	if (!ctx.message?.isValid) {
		throw new Error('Invalid message')
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
					There will be over 10,000 Kramer predictions before 9/29
					midnight?
				</div>
			</div>
		),
		textInput: 'Enter amount',
		buttons: [
			<Button
				key="yes"
				action="tx"
				target={{ pathname: '/submit', query: { outcome: 'positive' } }}
			>
				on yes
			</Button>,
			<Button
				key="no"
				action="tx"
				target={{ pathname: '/submit', query: { outcome: 'negative' } }}
			>
				on no
			</Button>,
		],
	}
})

export const GET = frameHandler
export const POST = frameHandler
