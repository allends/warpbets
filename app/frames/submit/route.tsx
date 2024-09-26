import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'
import { transaction } from 'frames.js/core'
import { base } from 'viem/chains'
import { Abi, encodeFunctionData } from 'viem'
import { z } from 'zod'
import { TGameFrame, TGameWager, TUser, userSchema } from '../../utils/parsers'
import FrameService from '../../db/frame'

const Receipt = (data: {
	title: string
	frame: TGameFrame
	wager: TGameWager
	user: TUser
}) => {
	const { wager, user, frame } = data

	const option = wager.option === 'a' ? frame.optionA : frame.optionB

	const Row = (props: { label: string; value: string }) => (
		<div tw="flex flex-row gap-2 mb-2">
			<div tw="w-1/3 flex">{props.label}:</div>
			<div tw="w-2/3 flex text-left">{props.value}</div>
		</div>
	)

	return {
		image: (
			<div tw="h-4/5 w-4/5 flex flex-col gap-4">
				<div tw="text-blue-500 mb-4" style={{
					fontFamily: 'Ankh Sanctuary',
					fontSize: '4rem',
				}}>{data.title}</div>
				<div tw="border border-slate-400 rounded-md flex flex-col p-8">
					<Row label="Owner" value={user.username} />
					<Row label="Stakes" value={frame.label} />
					<Row label="Predicted" value={option} />
					<Row label="Wagered" value={`${wager.amount.toString()} ETH`} />
				</div>
			</div>
		),
		buttons: [
			<Button
				key="yes"
				action="post"
				target={{ pathname: '/results', query: { frameId: frame.id } }}
			>
				See Current Wagers
			</Button>,
		],
	}
}

const frames = createFrames({
	basePath: '/frames',
	middleware: [
		farcasterHubContext({
			hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
})

const messageSchema = z.object({
	inputText: z.preprocess(
		(string) => parseInt(string as string, 10),
		z.number().int().positive()
	),
	requesterUserData: userSchema,
})

const searchParamsSchema = z.object({
	option: z.enum(['a', 'b']),
	frameId: z.string(),
})

const ctxSchema = z.object({
	message: messageSchema,
	searchParams: searchParamsSchema,
})

export const POST = frames(async (ctx) => {
	const result = ctxSchema.safeParse(ctx)

	if (result.success === false) {
		throw new Error('Invalid Context Input')
	}

	const { inputText, requesterUserData } = result.data.message
	const { option, frameId } = result.data.searchParams
	const { username } = requesterUserData

	console.log(result.data)
	const frame = await FrameService.getFrame(frameId)

	if (!frame) {
		throw new Error('Frame not found')
	}

	let bet = await FrameService.getWager(frameId, username)

	if (!bet) {
		bet = await FrameService.createWager({
			frameId,
			username,
			option,
			amount: inputText,
		})
	} else {
		return Receipt({
			title: 'You have already bet!',
			frame,
			wager: bet,
			user: requesterUserData,
		})
	}

	if (!bet) {
		throw new Error('Could not make / create bet')
	}

	return Receipt({
		title: 'Wager Placed!',
		frame,
		wager: bet,
		user: requesterUserData,
	})
})
