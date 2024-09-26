import type { NextApiRequest, NextApiResponse } from 'next'
import FrameService from '../../db/frame'
import { z } from 'zod'

export const createGameFrame = z.object({
	label: z.string(),
	optionA: z.string(),
	optionB: z.string(),
	expiration: z.number(),
})

export async function POST(req: Request, res: Response) {
	const body = await req.json()
	try {
		console.log(body)
		const parsedFrame = createGameFrame.safeParse(body)
		if (!parsedFrame.success) {
			return new Response('Error creating frame', { status: 500 })
		}
		const frame = await FrameService.createFrame(parsedFrame.data)
		if (!frame) {
			return new Response('Error creating frame', { status: 500 })
		}
		return new Response(JSON.stringify(frame))
	} catch {
		return new Response('Error creating frame', { status: 500 })
	}
}
