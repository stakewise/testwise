import { getAddress } from '@ethersproject/address'
import { BrowserContext, expect } from '@playwright/test'
import { appSelectors, links } from 'helpers'

import { ExtendedTestFixture } from 'fixtures/extendTest'


let isSigned = false

const sign = (browserContext: BrowserContext) => async (): Promise<void> => {
  const page = await browserContext.waitForEvent('page', { timeout: 50000 })

  await page.click(appSelectors.metaMaskPage.sign.signButton)

  isSigned = true
}

const confirm = (browserContext: BrowserContext): MetaMaskFixture.Export['confirm'] => async () => {
  const page = await browserContext.waitForEvent('page', { timeout: 50000 })

  const [ gas, maxAmount ] = await Promise.all([
    page.innerText(appSelectors.metaMaskPage.confirm.gasValue),
    page.innerText(appSelectors.metaMaskPage.confirm.maxAmountValue),
  ])
    .then((values) => values.map(Number))

  await page.click(appSelectors.metaMaskPage.confirm.confirmButton)

  return {
    gas,
    maxAmount,
  }
}

const signAndConfirm = (browserContext: BrowserContext): MetaMaskFixture.Export['signAndConfirm'] => async () => {
  const wasSigned = !isSigned

  if (!isSigned) {
    await sign(browserContext)()
  }

  const { gas, maxAmount } = await confirm(browserContext)()

  return {
    gas,
    maxAmount,
    wasSigned,
  }
}

const giveAccess = (browserContext: BrowserContext) => async (): Promise<MetaMaskFixture.GiveAccessResult> => {
  const page = await browserContext.waitForEvent('page', { timeout: 50000 })
  const shortAddress = await page.innerText(appSelectors.metaMaskPage.giveAccess.shortAddressForApproval)

  await page.click(appSelectors.metaMaskPage.giveAccess.confirmButton)

  return {
    shortAddress,
  }
}

const giveAccessAndConfirm = (browserContext: BrowserContext): MetaMaskFixture.Export['giveAccessAndConfirm'] => async () => {
  const { shortAddress } = await giveAccess(browserContext)()
  const { gas, maxAmount } = await confirm(browserContext)()

  return {
    gas,
    maxAmount,
    shortAddress,
  }
}

const getMetaMaskPage = (browserContext: BrowserContext) => {
  const pages = browserContext.pages()

  if (pages.length === 2) {
    return pages[1]
  }

  return browserContext.waitForEvent('page', { timeout: 50000 })
}

const resetAccount = (browserContext: BrowserContext): MetaMaskFixture.Export['resetAccount'] => async () => {
  const page = await browserContext.newPage()

  await page.goto(links.metaMask.settings)

  await page.click(appSelectors.metaMaskPage.settings.resetAccount)
  await page.waitForTimeout(1000)
  await page.click(appSelectors.metaMaskPage.settings.resetButton)

  // TODO need to fix: if we make reset without timeouts the metamask still shows old balances
  await page.waitForTimeout(3000)

  await page.close()
}

let isUnlocked = false

const unlock = (browserContext: BrowserContext): MetaMaskFixture.Export['unlock'] => async () => {
  if (isUnlocked) {
    await resetAccount(browserContext)()

    return isUnlocked
  }

  const page = await getMetaMaskPage(browserContext)

  await page.goto(links.metaMask.unlock)
  await page.click(appSelectors.metaMaskPage.unlock.passwordInput)
  await page.fill(appSelectors.metaMaskPage.unlock.passwordInput, '12345678')

  await Promise.all([
    page.waitForNavigation({ url: links.metaMask.root }),
    page.click(appSelectors.metaMaskPage.unlock.unlockButton),
  ])

  isUnlocked = true

  await page.close()

  return false
}

const approveConnect = (props: { store: StoreFixture.Export, browserContext: BrowserContext }): MetaMaskFixture.Export['approveConnect'] => async () => {
  const { store, browserContext } = props

  const page = await browserContext.waitForEvent('page', { timeout: 50000 })

  await page.click(appSelectors.metaMaskPage.approveConnect.selectAllAccountsCheckbox)
  await page.click(appSelectors.metaMaskPage.approveConnect.nextButton)
  await page.click(appSelectors.metaMaskPage.approveConnect.confirmButton)

  const [ originalPage ] = browserContext.pages()

  const address = await originalPage.evaluate(() => {
    return window.ethereum.selectedAddress
  })

  expect(getAddress(address)).toEqual(Object.keys(store.state.accounts)[0])

  store.setAddress(address)
}

// TODO investigate why without timeouts main page reloads on change network
const changeNetwork = (browserContext: BrowserContext): MetaMaskFixture.Export['changeNetwork'] => async () => {
  const page = await browserContext.waitForEvent('page', { timeout: 50000 })

  await page.waitForSelector(appSelectors.metaMaskPage.primaryButton)

  const isChangeNetworkApproved = await page.locator(appSelectors.metaMaskPage.changeNetwork.switchNetworkButton).isVisible()

  if (!isChangeNetworkApproved) {
    await page.click(appSelectors.metaMaskPage.changeNetwork.approveButton)

    await page.waitForTimeout(500)
  }

  await page.click(appSelectors.metaMaskPage.changeNetwork.switchNetworkButton)

  // await page.waitForEvent('close', { timeout: 50000 })
  await page.waitForTimeout(1000)
}

const changeAccount = (props: { store: StoreFixture.Export, browserContext: BrowserContext }): MetaMaskFixture.Export['changeAccount'] => async (account) => {
  const { store, browserContext } = props

  const page = await browserContext.newPage()
  await page.goto(links.metaMask.root)

  // Hide popup on accounts changing
  const popupCloseButton = page.locator('.popover-wrap button')
  const isPopupCloseButtonVisible = await popupCloseButton.isVisible({ timeout: 100 })

  if (isPopupCloseButtonVisible) {
    await popupCloseButton.click()
  }

  await page.click(appSelectors.metaMaskPage.changeAccount.accountButton)
  await page.click(`text=${account}`)

  const accountAddress = Object.keys(store.state.accounts).find((address) => (
    store.state.accounts[address]?.id === account
  ))

  store.setAddress(accountAddress as string)

  await page.close()
}

const metaMaskActions: ExtendedTestFixture<MetaMaskFixture.Export> = async ({ hardhat, store, browserContext }, use) => {
  await hardhat.resolve()

  use({
    unlock: unlock(browserContext),
    confirm: confirm(browserContext),
    resetAccount: resetAccount(browserContext),
    changeAccount: changeAccount({ store, browserContext }),
    changeNetwork: changeNetwork(browserContext),
    approveConnect: approveConnect({ store, browserContext }),
    signAndConfirm: signAndConfirm(browserContext),
    giveAccessAndConfirm: giveAccessAndConfirm(browserContext),
  })
}


export default metaMaskActions
