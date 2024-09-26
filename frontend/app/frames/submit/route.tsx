import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'
import BetService, { isBetType } from '../../db/bets';
import { transaction } from 'frames.js/core';
import abi from './bet.json' assert { type: "json" };
import { base } from 'viem/chains';
import { Abi, encodeFunctionData } from 'viem';

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

	const { message, searchParams } = ctx
	const outcome: string | undefined = searchParams?.['outcome']

	if (!message || !outcome || !isBetType(outcome)) {
		throw new Error('Invalid message')
	}

	const { inputText, requesterUserData } = message

	const { displayName, username } = requesterUserData ?? {}

	if (!displayName || !username) {
		throw new Error('Invalid user')
	}

	const existingBet = await BetService.getUserBet(username, outcome)

	if (existingBet) {
		throw new Error('Bet already exists')
	}

	const amount = parseFloat(inputText ?? '')

	if (isNaN(amount)) {
		throw new Error('Invalid amount')
	}

	const callData = encodeFunctionData({
		abi: abi,
		functionName: 'putStake',
		args: [outcome === 'positive', amount]
	})

	return transaction({
		method: 'eth_sendTransaction',
		params: {
			abi: abi as Abi,
			data: callData,
			to: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
		},
		chainId: 'eip155:' + base.id
	})
})
