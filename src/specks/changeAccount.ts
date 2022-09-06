import { ExtendedTestFixture } from 'fixtures'


export type ChangeAccount = (account: string) => Promise<void>

const changeAccount: ExtendedTestFixture<ChangeAccount> = async ({ store, page, metaMask }, use) => {
  await use(async (account) => {
    await metaMask.changeAccount(account)
    await page.waitForPageLoad()

    const address = await page.evaluate(() => {
      return window.ethereum.selectedAddress
    })

    store.setAddress(address)
  })
}


export default changeAccount
