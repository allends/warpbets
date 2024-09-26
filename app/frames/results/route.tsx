import { farcasterHubContext } from 'frames.js/middleware'
import { Button, createFrames } from 'frames.js/next'
import { DEFAULT_DEBUGGER_HUB_URL } from '../../debug'
import FrameService from '../../db/frame'
import { z } from 'zod'

const frames = createFrames({
	basePath: '/frames',
	middleware: [
		farcasterHubContext({
			hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
		}),
	],
	debug: process.env.NODE_ENV === 'development',
})

const searchParamsSchema = z.object({
	frameId: z.string(),
})

const ctxSchema = z.object({
	searchParams: searchParamsSchema,
})

export const POST = frames(async (ctx) => {
	console.log('here: ', ctx.searchParams)

	const result = ctxSchema.safeParse(ctx)

	if (result.success === false) {
		throw new Error('Invalid Context Input')
	}

	const wagerSummary = await FrameService.listFrameWagers(result.data.searchParams.frameId)

	if (!wagerSummary) {
		throw new Error('No wagers found')
	}

	const totalCount = wagerSummary.wagers.length
	const positiveCount = wagerSummary.optionACount
	const negativeCount = wagerSummary.optionBCount

	return {
		image: (
			<div tw="flex flex-row w-4/5 h-4/5 justify-between items-end relative">
				{
					totalCount === 0 && (
						<div tw="font-bold text-blue-500 flex absolute" style={{
							fontFamily: "'Ankh Sanctuary', sans-serif",
							fontSize: '8rem',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}>no bets</div>
					)
				}
				<div tw="flex flex-col h-full items-center justify-end">
					<div
						tw="bg-green-600 flex"
						style={{
							height: totalCount === 0 ? '0px' : `${(positiveCount / totalCount) * 100}%`,
							width: '300px',
							marginBottom: '20px',
							borderRadius: '10px 10px 0px 0px',
						}}
					/>
					<div tw="text-2xl font-bold text-green-600 flex">{`Yes (${positiveCount})`}</div>
				</div>
				<div tw="flex flex-col h-full items-center justify-end">
					<div
						tw="bg-red-400 flex rounded-sm"
						style={{
							height: totalCount === 0 ? '0px' : `${(negativeCount / totalCount) * 100}%`,
							width: '300px',
							marginBottom: '20px',
							borderRadius: '10px 10px 0px 0px',
						}}
					/>
					<div tw="text-2xl font-bold text-red-400 flex">{`No (${negativeCount})`}</div>
				</div>
			</div>
		),
		buttons: [
			<Button key="button" action="post" target="/">
				Home
			</Button>,
		],
	}
})
