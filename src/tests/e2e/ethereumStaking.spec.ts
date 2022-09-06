import { Balance, appSelectors } from 'helpers'

import { expect, test as base } from 'fixtures'
import type { ExtendedTestArgs } from 'fixtures'

import { stake, checkBalances, connectWallet, disconnectWallet, changeAccount } from 'specks'
import type { Stake, CheckBalances, ConnectWallet, DisconnectWallet, ChangeAccount } from 'specks'


type ExtendedTest = ExtendedTestArgs & {
  stake: Stake
  connectWallet: ConnectWallet
  checkBalances: CheckBalances
  changeAccount: ChangeAccount
  disconnectWallet: DisconnectWallet
}

const stakedTokenBalance = new Balance(0)

const test = base.extend<ExtendedTest>({
  stake,
  connectWallet,
  checkBalances,
  changeAccount,
  disconnectWallet,
})

// TODO add tests with uniswap and blocked uniswap
test.describe('Mainnet staking with MetaMask', async () => {
  test.beforeAll(async ({ store, connectWallet, hardhat }) => {
    await hardhat.resetNetwork('mainnet')
    await connectWallet()

    stakedTokenBalance.set(store.state.account.balances.stakedToken || 0)
  })

  test.afterAll(async ({ disconnectWallet }) => {
    await disconnectWallet()
  })

  test.afterEach(async ({ page }) => {
    await page.refresh()
    await page.waitForRpcRequests()
    await page.waitForPageLoad()
  })

  test('can stake 32 ETH', async ({ stake, checkBalances }) => {
    const stakingAmount = 32
    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake 33 ETH', async ({ stake, checkBalances }) => {
    const stakingAmount = 33
    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake 0.4999 ETH', async ({ stake, checkBalances }) => {
    const stakingAmount = 0.4999
    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake ETH after network changing', async ({ page, stake, checkBalances }) => {
    const stakingAmount = 1

    await page.changeNetwork('gnosis')
    await page.changeNetwork('mainnet')

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake ETH after disconnecting', async ({ stake, checkBalances, connectWallet, disconnectWallet }) => {
    const stakingAmount = 2

    await disconnectWallet()
    await connectWallet()

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake ETH after changing accounts', async ({ stake, checkBalances, changeAccount }) => {
    const stakingAmount = 3

    await changeAccount('account_2')
    await changeAccount('account_1')

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('validates the amount input field in the stake tab on ethereum', async ({ page }) => {
    await page.fill(appSelectors.widgets.main.stake.input, '0')
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.stake.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(validationText).toEqual('Must be greater than 0')
    // expect(isButtonDisabled).toBe(true)
  })

  test('validates the amount field with insufficient ETH balance', async ({ page, store }) => {
    const nativeTokenStoreBalance = store.state.account.balances.nativeToken as number
    const insufficientBalance = nativeTokenStoreBalance + 0.001

    await page.fill(appSelectors.widgets.main.stake.input, insufficientBalance.toString())
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.stake.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(validationText).toEqual('Insufficient balance on selected wallet')
    // expect(isButtonDisabled).toBe(true)
  })

  test("can't set any symbols in the amount field in the stake tab on ethereum", async ({ page }) => {
    const symbols = '@#$%^&*()?!;":`~<>{}[]q-_=+/|.,№±§'
    await page.fill(appSelectors.widgets.main.stake.input, symbols, { noWaitAfter: true })

    const inputValue = await page.inputValue(appSelectors.widgets.main.stake.input)
    expect(inputValue).toEqual('')

    // Blur input to get validation error
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.stake.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(validationText).toEqual('Must be a number with dot as a decimal point')
    // expect(isButtonDisabled).toBe(true)
  })

  test("doesn't duplicates values from the reinvest widget on ethereum", async ({ page }) => {
    await page.click(appSelectors.widgets.main.reinvest.tab)

    await page.fill(appSelectors.widgets.main.reinvest.input, '10')
    await page.click(appSelectors.widgets.main.reinvest.termsCheckbox)
    await page.click(appSelectors.widgets.main.stake.tab)

    const inputValue = await page.inputValue(appSelectors.widgets.main.stake.input)
    const checkboxValue = await page.getAttribute(appSelectors.widgets.main.stake.termsCheckbox, 'aria-checked')
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(inputValue).toEqual('')
    expect(checkboxValue).toEqual('')
    // expect(isButtonDisabled).toBe(true)
  })

  test('can stake all ETH', async ({ stake, checkBalances }) => {
    const stakedAmount = await stake()

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })
})
