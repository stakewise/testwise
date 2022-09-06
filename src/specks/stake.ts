import { formatEther, parseEther } from 'ethers/lib/utils'
import { expect, ExtendedTestFixture } from 'fixtures'
import { appSelectors } from 'helpers'


export type Stake = (amount?: number) => Promise<number>

let isAddTokensModalClosed = false

const stake: ExtendedTestFixture<Stake> = async ({ api, store, page, metaMask }, use) => {
  await use(async (amount?: number) => {
    const isGnosis = store.state.config.network === 'gnosis'

    if (amount) {
      await page.fill(appSelectors.widgets.main.stake.input, amount.toString())
    }
    else {
      await page.click(appSelectors.widgets.main.stake.maxButton)
    }

    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    await page.waitForRpcRequests()

    let receiveAmount
    let inputAmount

    if (amount) {
      inputAmount = amount
    }
    else {
      const inputValue = await page.inputValue(appSelectors.widgets.main.stake.input)
      inputAmount = Number(inputValue)
    }

    const tooltipIcon = page.locator(appSelectors.widgets.main.stake.tooltipIcon)
    const isTooltipIconVisible = await tooltipIcon.isVisible()
    let additionalAmount = '0'

    if (isTooltipIconVisible) {
      await page.hover(appSelectors.widgets.main.stake.tooltipIcon)
      // TODO add tid to additional amount in the tooltip
      const tooltipText = await page.textContent(appSelectors.tooltip)

      additionalAmount = tooltipText?.match(/\s\d+\.?\d+\s/g)?.[0].trim() || '0'
    }

    receiveAmount = parseEther(additionalAmount).add(parseEther(inputAmount.toString()))
    receiveAmount = Number(formatEther(receiveAmount))

    if (isTooltipIconVisible) {
      expect(receiveAmount).toBeGreaterThan(inputAmount)
    }
    else {
      expect(receiveAmount).toEqual(inputAmount)
    }

    await page.click(appSelectors.widgets.main.stake.confirmButton)

    if (isGnosis) {
      await metaMask.giveAccessAndConfirm()
    }
    else {
      await metaMask.confirm()
    }

    await Promise.all([
      !isAddTokensModalClosed && page.click(appSelectors.closeModalButton),
      page.waitForRpcRequests(),
    ])

    isAddTokensModalClosed = true

    return receiveAmount as number
  })
}


export default stake
