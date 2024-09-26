import { createGameWagerKey, gameFrame, TGameFrame, gameWager, TGameWager } from "../utils/parsers";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from 'uuid';

const createFrame = async (frame: Omit<TGameFrame, "id"> & { id?: string }): Promise<TGameFrame | undefined> => {
	const id = frame.id ?? uuidv4()

	const newFrame = {
		...frame,
		id,
	}

	const result = await kv.set(`frame:${id}`, newFrame)

	if (result === "OK") {
		return newFrame
	}

	return result ?? undefined
}

const getFrame = async (id: string): Promise<TGameFrame | undefined> => {
	const frame = await kv.get(`frame:${id}`)

	if (!frame) {
		return undefined
	}

	const parsedFrame = gameFrame.safeParse(frame)

	if (!parsedFrame.success) {
		return undefined
	}

	return parsedFrame.data
}

const createWager = async (wager: TGameWager): Promise<TGameWager | undefined> => {
	const id = createGameWagerKey(wager.frameId, wager.username)
	const result = await kv.set(id, wager)

	if (result === "OK") {
		return wager
	}

	return result ?? undefined
}

const getWager = async (frameId: string, userId: string): Promise<TGameWager | undefined> => {
	const id = createGameWagerKey(frameId, userId)
	const wager = await kv.get(id)

	if (!wager) {
		return undefined
	}

	const parsedWager = gameWager.safeParse(wager)

	if (!parsedWager.success) {
		return undefined
	}

	return parsedWager.data
}

const deleteFrame = async (id: string): Promise<boolean> => {
	const result = await kv.del(`frame:${id}`)

	return result === 1
}

const listFrameWagers = async (frameId: string): Promise<{
	optionACount: number
	optionBCount: number
	optionATotal: number
	optionBTotal: number
	wagers: TGameWager[]
} | undefined> => {
	console.log('frameId: ', frameId)

	const keys = await kv.keys(`wager:${frameId}:*`)

	let optionACount = 0
	let optionBCount = 0

	let optionATotal = 0
	let optionBTotal = 0

	let wagers = []

	for (const key of keys) {
		const wager = await kv.get(key)

		if (wager) {
			const parsedWager = gameWager.safeParse(wager)

			if (parsedWager.success) {
				wagers.push(parsedWager.data)
				if (parsedWager.data.option === 'a') {
					optionACount++
					optionATotal += parsedWager.data.amount
				} else if (parsedWager.data.option === 'b') {
					optionBCount++
					optionBTotal += parsedWager.data.amount
				}
			}
		}
	}

	return {
		optionACount,
		optionBCount,
		optionATotal,
		optionBTotal,
		wagers,
	}
}

const FrameService = {
	createFrame,
	getFrame,
	createWager,
	getWager,
	deleteFrame,
	listFrameWagers,
}

export default FrameService
