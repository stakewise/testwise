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

const initialDepositTokenBalance = 10000

const depositTokenBalance = new Balance(0)
const stakedTokenBalance = new Balance(0)

const test = base.extend<ExtendedTest>({
  stake,
  connectWallet,
  checkBalances,
  changeAccount,
  disconnectWallet,
})

// TODO add tests with blocked curve flow
// TODO add tests with mGNO staking
test.describe('Gnosis staking with MetaMask', async () => {
  test.beforeAll(async ({ connectWallet, hardhat, store }) => {
    await hardhat.resetNetwork('gnosis')

    const address = Object.keys(store.state.accounts)[0]

    await connectWallet({
      beforeConnect: () => hardhat.addDepositToken(initialDepositTokenBalance, address)
    })

    stakedTokenBalance.set(store.state.account.balances.stakedToken || 0)
    depositTokenBalance.set(store.state.account.balances.depositToken || 0)
  })

  test.afterAll(async ({ disconnectWallet }) => {
    await disconnectWallet()
  })

  test.afterEach(async ({ page }) => {
    await page.refresh()
    await page.waitForRpcRequests()
    await page.waitForPageLoad()
  })

  test('can stake 1 GNO', async ({ stake, checkBalances }) => {
    const stakingAmount = 32
    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake 0.4999 GNO', async ({ stake, checkBalances }) => {
    const stakingAmount = 0.4999
    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake GNO after network changing', async ({ page, stake, checkBalances }) => {
    const stakingAmount = 1

    await page.changeNetwork('mainnet')
    await page.changeNetwork('gnosis')

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake GNO after disconnecting', async ({ stake, checkBalances, connectWallet, disconnectWallet }) => {
    const stakingAmount = 2

    await disconnectWallet()
    await connectWallet()

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('can stake GNO after changing accounts', async ({ stake, checkBalances, changeAccount }) => {
    const stakingAmount = 3

    await changeAccount('account_2')
    await changeAccount('account_1')

    const stakedAmount = await stake(stakingAmount)

    stakedTokenBalance.add(stakedAmount)

    await checkBalances({
      stakedTokenBalance,
    })
  })

  test('validates the amount input field in the stake tab on gnosis', async ({ page }) => {
    await page.fill(appSelectors.widgets.main.stake.input, '0')
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.stake.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(validationText).toEqual('Must be greater than 0')
    // expect(isButtonDisabled).toBe(true)
  })

  test('validates the amount field with insufficient GNO balance', async ({ page, store }) => {
    const depositTokenStoreBalance = store.state.account.balances.depositToken as number
    const insufficientBalance = depositTokenStoreBalance + 0.001

    await page.fill(appSelectors.widgets.main.stake.input, insufficientBalance.toString())
    await page.click(appSelectors.widgets.main.stake.termsCheckbox)

    const validationText = await page.textContent(appSelectors.widgets.main.stake.inputValidation)
    // TODO add disabled property to the button
    // const isButtonDisabled = await page.locator(appSelectors.widgets.main.stake.confirmButton).isDisabled()

    expect(validationText).toEqual('Insufficient balance on selected wallet')
    // expect(isButtonDisabled).toBe(true)
  })

  test("can't set any symbols in the amount field in the stake tab on gnosis", async ({ page }) => {
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

  test("doesn't duplicates values from the reinvest widget on gnosis", async ({ page }) => {
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

  // TODO add approve flow
  // test('can stake all GNO', async ({ stake, checkBalances }) => {
  //   const stakedAmount = await stake()
  //
  //   stakedTokenBalance.add(stakedAmount)
  //
  //   await checkBalances({
  //     stakedTokenBalance,
  //   })
  // })
})
