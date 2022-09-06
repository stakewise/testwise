import { expect, test } from 'fixtures'



let sEthHBalance: number = 0

test.describe('Harbour withdraw with MetaMask', async () => {
  test.afterEach(async () => {
    await mainPageConnectedWallet.page.refresh()
    await page.waitForPageLoad()
  })

  test('withdraw 1 SETH-H', async () => {
    const withdrawAmount = 1

    // const provider = hre.eoa.privateKey()
    // const sign = provider.getSigner('0x60b3E48204a8EE04f91D45C53a42F22be12e325C')

    await mainPageConnectedWallet.mainWidget.mainWithdrawTab().click()
    const stackedAmount = await mainPageConnectedWallet.mainWidget.withdrawSEthH(withdrawAmount)
    sEthHBalance = sEthHBalance + withdrawAmount

    metaMaskGiveAccessPage = new MetaMaskGiveAccessPage(await browserContext.waitForEvent('page', { timeout: 50000 }))
    await mainPageConnectedWallet.page.pause()
    const giveAccessInformation = await metaMaskGiveAccessPage.confirmAccess()
    expect(giveAccessInformation.shortAddressForApproval).toEqual('0x119c...2828')

    await mainPageConnectedWallet.mainWidget.mainWithdrawConfirmButton().click()

    metaMaskSignPage = new MetaMaskSignPage(await browserContext.waitForEvent('page', { timeout: 50000 }))
    const approveInformation = await metaMaskConfirmPaymentPage.confirmPayment()


    // await mainPageConnectedWallet.addTokensModal.closeButton().click()

    // await page.waitForPageLoad()
    // expect(await mainPageConnectedWallet.stakingAprWidget.getStakingAprValue()).toEqual(await backendApi.getStakingApr(ApiNetworks.mainnet))
    // expect(await mainPageConnectedWallet.header.getHeaderTokenBalance()).toBeGreaterThanOrEqual(approveInformation.maxAmountValue)
    // expect(await mainPageConnectedWallet.stakingWidget.getSeth2TokenAmount()).toEqual(Math.floor(sEth2Balance * 10000) / 10000)
  })
})
