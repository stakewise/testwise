import { ExtendedTestFixture } from 'fixtures'
import { appSelectors } from 'helpers'


export type DisconnectWallet = () => Promise<void>

const disconnectWallet: ExtendedTestFixture<DisconnectWallet> = async ({ store, page }, use) => {
  await use(async () => {
    await page.click(appSelectors.header.headerSettingsButton)
    await page.click(appSelectors.header.settingsDropdownDisconectItem)
    await page.waitForPageLoad()

    const previousNetwork = store.state.config.network

    // After disconnecting the network is switched to mainnet
    store.setNetwork('mainnet')
    store.setAddress(null)

    await page.checkStakingApr()

    // We set previous network again, since in connectWallet we request balances.
    // If the previous network was 'gnosis' and after disconnecting we've switched
    // to 'mainnet', then these requests will fail (because hardhat's network is
    // still 'gnosis').
    // If we reset the hardhat's network here, then we'll need to update manually
    // calculated balances, since all the transaction history will be lost.
    // TODO fix this, add multiple hardhat instances for all networks that we use
    store.setNetwork(previousNetwork)
  })
}


export default disconnectWallet
