import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const BetModule = buildModule('Bet', (m) => {
	const expirationDate = new Date('2024-09-29T00:00:00Z').getTime() / 1000

	const expiryTime = m.getParameter('expirationTime', expirationDate)
	const message = m.getParameter(
		'message',
		'There will be over  10,000 Kramer predictions before 9/29 midnight'
	)
	const optionA = m.getParameter('optionA', 'Yes')
	const optionB = m.getParameter('optionB', 'No')

	const lock = m.contract('Bet', [expiryTime, message, optionA, optionB])

	return { lock }
})

export default BetModule
