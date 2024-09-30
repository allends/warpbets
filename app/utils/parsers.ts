import { z } from "zod"

// User
export const userSchema = z.object({
	username: z.string(),
	displayName: z.string(),
	profileImage: z.string(),
	bio: z.string().optional(),
})

export const isUser = (user: unknown): user is TUser => {
	return userSchema.safeParse(user).success
}

export type TUser = z.infer<typeof userSchema>

// Game Frame
export const gameFrame = z.object({
	id: z.string(),
	label: z.string(),
	optionA: z.string(),
	optionB: z.string(),
	expiration: z.number(),
})

export const isGameFrame = (frame: unknown): frame is TGameFrame => {
	return gameFrame.safeParse(frame).success
}

export type TGameFrame = z.infer<typeof gameFrame>

// Game Wager
export const gameWager = z.object({
	frameId: z.string(),
	username: z.string(),
	option: z.enum(['a', 'b']),
	amount: z.number(),
})

export const isGameWager = (wager: unknown): wager is TGameWager => {
	return gameWager.safeParse(wager).success
}

// Game Summary
export const gameSummary = z.object({
	optionACount: z.number(),
	optionBCount: z.number(),
	optionBTotal: z.number(),
	optionATotal: z.number(),
})

export type TGameWager = z.infer<typeof gameWager>

export const createGameWagerKey = (frameId: string, userId: string) => `wager:${frameId}:${userId}`

export const createGameSummaryKey = (frameId: string) => `wagerSummary:${frameId}`
