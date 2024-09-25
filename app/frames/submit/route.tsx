import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'
import BetService, { isBetType } from '../../db/bets';

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

	const { message, searchParams } = ctx
	const outcome: string | undefined = searchParams?.['outcome']

	if (!message || !outcome || !isBetType(outcome)) {
		return {
			image: <div>Fill out the prediction form!</div>,
			buttons: [
				<Button key="button" action="post" target="/main">
					{`I'll do that`}
				</Button>,
			],
		}
	}

	const { inputText, requesterUserData } = message

	const { displayName, username } = requesterUserData ?? {}

	if (!displayName || !username) {
		return {
			image: <div>Please login to make a prediction</div>,
			buttons: [
				<Button key="button" action="post" target="/main">
					Fine
				</Button>,
			],
		}
	}

	const existingBet = await BetService.getUserBet(username, outcome)

	if (existingBet) {
		return {
			image: (
				<div>
					{`You've already bet ${existingBet} on ${outcome}`}
				</div>
			),
			buttons: [
				<Button key="button" action="post" target="/main">
					Alrighty
				</Button>,
			],
		}
	}

	const amount = parseFloat(inputText ?? '')

	if (isNaN(amount)) {
		return {
			image: <div>Enter a valid amount to bet please</div>,
			buttons: [
				<Button key="button" action="post" target="/main">
					I understand
				</Button>,
			],
		}
	}

	// this is where we can create the entry for the bet
	const userBet = await BetService.createUserBet(username, outcome, amount, outcome)

	if (!userBet) {
		return {
			image: <div>Something went wrong, try again later</div>,
			buttons: [
				<Button key="button" action="post" target="/main">
					Ok
				</Button>,
			],
		}
	}

	return {
		image: (
			<div tw="flex flex-col">
				<div tw="flex">{`You're in`}</div>
				<div tw="flex">
					{displayName} bet {amount} on {outcome}
				</div>
			</div>
		),
		buttons: [
			<Button key="button" action="post">
				Cool
			</Button>,
		],
	}
})
