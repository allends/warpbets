import { kv } from '@vercel/kv'

const BetTypes = ['positive', 'negative'] as const
type BetType = typeof BetTypes[number]

export const isBetType = (type: string): type is BetType => {
	return BetTypes.includes(type as BetType)
}


type UserBet = {
	userName: string
	amount: number
	type: BetType
}

// add in options to this
type Bet = {
	title: string
	id: string

}

const createBetKey = (userName: string, betId: string) => `bet:${userName}:${betId}`

const getUserBet = async (userName: string, betId: string): Promise<number | undefined> => {
	const amount = await kv.get(createBetKey(userName, betId))
	if (!amount || typeof amount !== 'number' || isNaN(amount)) {
		return undefined
	}
	return amount
}

const createUserBet = async (userName: string, betId: string, amount: number, type: BetType): Promise<UserBet | undefined> => {

	const adjustedAmount = type === 'positive' ? Math.abs(amount) : -Math.abs(amount)

	const result = await kv.set(createBetKey(userName, betId), amount)

	if (!result) {
		return undefined
	}

	return {
		userName,
		amount,
		type,
	}
}

const listBets = async (betId: string) => {
	const keys = await kv.keys(`bet:*:${betId}`)
	let positiveCount = 0
	let negativeCount = 0
	const bets = []

	for (const key of keys) {
		const [_, userName, __] = key.split(':')
		const amount = await kv.get(key)
		if (!amount || typeof amount !== 'number' || isNaN(amount)) {
			continue
		}
		bets.push({ userName, amount })
		if (amount > 0) {
			positiveCount++
		} else {
			negativeCount++
		}
	}

	return { bets, positiveCount, negativeCount }
}

const BetService = {
	getUserBet,
	createUserBet,
	listBets,
}

export default BetService