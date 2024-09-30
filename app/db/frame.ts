import { createGameWagerKey, gameFrame, TGameFrame, gameWager, TGameWager, createGameSummaryKey, gameSummary } from "../utils/parsers";
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

	const summaryKey = createGameSummaryKey(wager.frameId)

	const _summary = await kv.get(summaryKey)

	let { success, data } = gameSummary.safeParse(_summary)

	if (!success) {
		data = {
			optionACount: 0,
			optionBCount: 0,
			optionATotal: 0,
			optionBTotal: 0,
		}
	}

	if (!data) {
		return undefined
	}

	if(wager.option === 'a') {
		data.optionACount++
		data.optionATotal += wager.amount
	} else {
		data.optionBCount++
		data.optionBTotal += wager.amount
	}

	await kv.set(summaryKey, data)

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
} | undefined> => {
	
	const gameSummaryKey = createGameSummaryKey(frameId)

	const _summary = await kv.get(gameSummaryKey)

	if (!_summary) {
		return undefined
	}

	const response = gameSummary.safeParse(_summary)

	if (!response.success) {
		return undefined
	}

	return {
		...response.data
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
