import {
	time,
	loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import hre from 'hardhat'
describe('Bet', function () {

	const expirationDate = new Date('2024-09-29T00:00:00Z').getTime() / 1000

	async function deployBetFixture() {
		const Bet = await hre.ethers.getContractFactory('Bet')

		// 9/29 midnight
		const message = "There will be over  10,000 Kramer predictions before 9/29 midnight"
		const optionA = "Yes"
		const optionB = "No"

		const bet = await Bet.deploy(expirationDate, message, optionA, optionB)
		return { bet }
	}

	describe('Deployment', function () {
		it('Should set the right expirationDate', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			expect(await bet.expirationTime()).to.equal(expirationDate)
		})

		it('Should set the right message', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			expect(await bet.message()).to.equal("There will be over  10,000 Kramer predictions before 9/29 midnight")
		})

		it('Should set the right optionA', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			expect(await bet.optionA()).to.equal("Yes")
		})

		it('Should set the right optionB', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			expect(await bet.optionB()).to.equal("No")
		})
	})

	describe('Bet', function () {
		it('Should set the right expirationDate', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			expect(await bet.expirationTime()).to.equal(expirationDate)
		})

		it('Should increase the amount on optionA', async function () {
			const { bet } = await loadFixture(deployBetFixture)

			await bet.putStake(true, 100)
			expect(await bet.totalStakesA()).to.equal(100)

			await bet.putStake(true, 100)
			expect(await bet.totalStakesA()).to.equal(200)
		})

		it('Should increase the amount on optionB', async function () {
			const { bet } = await loadFixture(deployBetFixture)

			await bet.putStake(false, 100)
			expect(await bet.totalStakesB()).to.equal(100)

			await bet.putStake(false, 100)
			expect(await bet.totalStakesB()).to.equal(200)
		})

		it('Should revert if the expirationDate has passed', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			const date = await bet.expirationTime()
			await time.increaseTo(date)
			await expect(bet.putStake(true, 100)).to.be.revertedWith('Staking deadline has passed')
		})
	})

	describe('Withdrawals', function () {
		it('Should revert if the expirationDate has not passed', async function () {
			const { bet } = await loadFixture(deployBetFixture)
			await expect(bet.withdraw()).to.be.revertedWith('Deadline not yet reached')
		})
	})

})