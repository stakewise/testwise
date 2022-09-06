import { Balance, appSelectors } from 'helpers'

import { reinvest, connectWallet, disconnectWallet, checkBalances, changeAccount } from 'specks'
import type { Reinvest, ConnectWallet, DisconnectWallet, CheckBalances, ChangeAccount } from 'specks'

import { expect, test as base } from 'fixtures'
import type { ExtendedTestArgs } from 'fixtures'


type ExtendedTest = ExtendedTestArgs & {
  reinvest: Reinvest
  connectWallet: ConnectWallet
  checkBalances: CheckBalances
  changeAccount: ChangeAccount
  disconnectWallet: DisconnectWallet
}

const initialRewardTokenBalance = 10

const stakedTokenBalance = new Balance(0)
const rewardTokenBalance = new Balance(0)

const test = base.extend<ExtendedTest>({
  reinvest,
  connectWallet,
  checkBalances,
  changeAccount,
  disconnectWallet,
})

test.describe('Mainnet reinvest with MetaMask', async () => {
  test.beforeAll(async ({ store, hardhat, connectWallet }) => {
    await hardhat.resetNetwork('mainnet')

    const address = Object.keys(store.state.accounts)[0]

    await connectWallet({
      beforeConnect: () => hardhat.addRewardToken(initialRewardTokenBalance, address)
    })

    stakedTokenBalance.set(store.state.account.balances.stakedToken || 0)
    rewardTokenBalance.set(store.state.account.balances.rewardToken || 0)
  })

  test.afterAll(async ({ disconnectWallet }) => {
    await disconnectWallet()
  })

  test.afterEach(async ({ page, store }) => {
    await page.refresh()
    await page.waitForRpcRequests()
    await page.waitForPageLoad()

    if (store.state.account.balances.stakedToken) {
      stakedTokenBalance.set(store.state.account.balances.stakedToken)
    }
    if (store.state.account.balances.rewardTokenBalance) {
      stakedTokenBalance.set(store.state.account.balances.rewardTokenBalance)
    }
  })

  test('can reinvest 1 rETH', async ({ reinvest, checkBalances }) => {
    const reinvestingAmount = 1

    const reinvestedAmount = await reinvest(reinvestingAmount)

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.remove(reinvestingAmount)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })

  test('can reinvest 0.4999 rETH', async ({ reinvest, checkBalances }) => {
    const reinvestingAmount = 0.4999

    const reinvestedAmount = await reinvest(reinvestingAmount)

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.remove(reinvestingAmount)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })

  test('can reinvest sETH after network changing', async ({ page, reinvest, checkBalances }) => {
    const reinvestingAmount = 2

    await page.changeNetwork('gnosis')
    await page.changeNetwork('mainnet')

    const reinvestedAmount = await reinvest(reinvestingAmount)

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.remove(reinvestingAmount)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })

  test('can reinvest rETH after disconnecting', async ({ reinvest, checkBalances, connectWallet, disconnectWallet }) => {
    const reinvestingAmount = 3

    await disconnectWallet()
    await connectWallet()

    const reinvestedAmount = await reinvest(reinvestingAmount)

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.remove(reinvestingAmount)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })

  test('can reinvest rETH after changing accounts', async ({ reinvest, checkBalances, changeAccount }) => {
    const reinvestingAmount = 3

    await changeAccount('account_2')
    await changeAccount('account_1')

    const reinvestedAmount = await reinvest(reinvestingAmount)

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.remove(reinvestingAmount)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })

  test('validates the amount input field in the reinvest tab on ethereum', async ({ page }) => {
    await page.click(appSelectors.widgets.main.reinvest.tab)
    await page.fill(appSelectors.widgets.main.reinvest.input, '0')
    await page.click(appSelectors.widgets.main.reinvest.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.reinvest.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.reinvest.confirmButton).isDisabled()

    expect(validationText).toEqual('Must be greater than 0')
    // expect(isButtonDisabled).toBe(true)
  })

  test('validates the amount field with insufficient rETH balance', async ({ page, store }) => {
    const rewardTokenStoreBalance = store.state.account.balances.rewardToken as number
    const insufficientBalance = rewardTokenStoreBalance + 0.001

    await page.click(appSelectors.widgets.main.reinvest.tab)
    await page.fill(appSelectors.widgets.main.reinvest.input, insufficientBalance.toString())
    await page.click(appSelectors.widgets.main.reinvest.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.reinvest.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.reinvest.confirmButton).isDisabled()

    expect(validationText).toEqual('Insufficient balance on selected wallet')
    // expect(isButtonDisabled).toBe(true)
  })

  test("can't set any symbols in the amount field in the reinvest tab on ethereum", async ({ page }) => {
    await page.click(appSelectors.widgets.main.reinvest.tab)

    const symbols = '@#$%^&*()?!;":`~<>{}[]q-_=+/|.,№±§'
    await page.fill(appSelectors.widgets.main.reinvest.input, symbols, { noWaitAfter: true })

    const inputValue = await page.inputValue(appSelectors.widgets.main.reinvest.input)
    expect(inputValue).toEqual('')

    // Blur input to get validation error
    await page.click(appSelectors.widgets.main.reinvest.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.reinvest.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.reinvest.confirmButton).isDisabled()

    expect(validationText).toEqual('Must be a number with dot as a decimal point')
    // expect(isButtonDisabled).toBe(true)
  })

  test("doesn't duplicates values from the staking widget on ethereum", async ({ page }) => {
    await page.fill(appSelectors.widgets.main.stake.input, '10')
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)
    await page.click(appSelectors.widgets.main.reinvest.tab)

    const inputValue = await page.inputValue(appSelectors.widgets.main.reinvest.input)
    const checkboxValue = await page.getAttribute(appSelectors.widgets.main.reinvest.termsCheckbox, 'aria-checked')
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.reinvest.confirmButton).isDisabled()

    expect(inputValue).toEqual('')
    expect(checkboxValue).toEqual('')
    // expect(isButtonDisabled).toBe(true)
  })

  test('can reinvest all rETH', async ({ reinvest, checkBalances }) => {
    const reinvestedAmount = await reinvest()

    stakedTokenBalance.add(reinvestedAmount)
    rewardTokenBalance.set(0)

    await checkBalances({
      rewardTokenBalance,
      stakedTokenBalance,
    })
  })
})
