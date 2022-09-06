import { expect, ExtendedTestFixture } from 'fixtures'
import { appSelectors, formatTokenValue, shortenAddress } from 'helpers'


export type ConnectWallet = (props?: { beforeConnect?: () => Promise<void> }) => Promise<void>

const connectWallet: ExtendedTestFixture<ConnectWallet> = async ({ store, metaMask, page, hardhat }, use) => {
  await use(async (props) => {
    const [ wasUnlocked ] = await Promise.all([
      metaMask.unlock(),
      typeof props?.beforeConnect === 'function'
        ? props.beforeConnect().then(hardhat.getBalances)
        : hardhat.getBalances(),
    ])

    await page.goTo('/')

    await page.click(appSelectors.header.headerConnectWalletButton)
    await page.click(appSelectors.header.connectWalletDropdownMetaMaskItem)

    if (wasUnlocked) {
      const address = await page.evaluate(() => {
        return window.ethereum.selectedAddress
      })

      store.setAddress(address)
    }
    else {
      await metaMask.approveConnect()

      await page.checkBottomLoader({
        text: 'Waiting for authorisation request to be approved in MetaMask',
        visible: false,
      })

      await page.checkNotification('Successfully connected with MetaMask')
    }

    await Promise.all([
      page.waitForRpcRequests(),
      page.waitForPageLoad(),
    ])

    await page.checkStakingApr()

    const [
      headerAddress,
      headerTokenBalance,
    ] = await Promise.all([
      page.textContent(appSelectors.header.headerAddress),
      page.getCountNumberValue(appSelectors.header.headerTokenBalance),
    ])

    const formattedStateNativeTokenBalance = formatTokenValue({
      value: store.state.account.balances.nativeToken?.toString() as string,
      withSeparator: false,
    })

    expect(headerTokenBalance).toEqual(Number(formattedStateNativeTokenBalance))
    expect(headerAddress).toEqual(shortenAddress(store.state.account.address, -4))
  })
}


export default connectWallet
