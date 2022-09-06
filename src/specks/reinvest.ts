import { expect, ExtendedTestFixture } from 'fixtures'
import { appSelectors } from 'helpers'


export type Reinvest = (amount?: number) => Promise<number>

const reinvest: ExtendedTestFixture<Reinvest> = async ({ api, store, page, metaMask }, use) => {
  await use(async (amount?: number) => {
    const isGnosis = store.state.config.network === 'gnosis'

    await page.click(appSelectors.widgets.main.reinvest.tab)

    if (amount) {
      await page.fill(appSelectors.widgets.main.reinvest.input, amount.toString())
    }
    else {
      await page.click(appSelectors.widgets.main.reinvest.maxButton)
    }

    await page.click(appSelectors.widgets.main.reinvest.termsCheckbox)

    await page.waitForRpcRequests()

    await page.hover(appSelectors.widgets.main.reinvest.tooltipIcon)

    let inputAmount

    if (amount) {
      inputAmount = amount
    }
    else {
      const inputValue = await page.inputValue(appSelectors.widgets.main.reinvest.input)
      inputAmount = Number(inputValue)
    }

    // TODO add tid to additional amount in the tooltip
    const receiveAmount = await page.getNumberValue(appSelectors.tooltip)

    // Currently, on gnosis reinvest amount is less than input
    if (!isGnosis) {
      expect(receiveAmount).toBeGreaterThan(inputAmount)
    }

    await page.click(appSelectors.widgets.main.reinvest.confirmButton)

    if (isGnosis) {
      await metaMask.giveAccessAndConfirm()
    }
    else {
      await metaMask.signAndConfirm()
    }

    await page.waitForRpcRequests()

    return receiveAmount
  })
}


export default reinvest
