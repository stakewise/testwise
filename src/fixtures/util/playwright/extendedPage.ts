import { Route } from 'playwright'

import { appSelectors } from 'helpers'
import { expect, ExtendedTestFixture } from '../../index'


let page: PageFixture.Export

const waitForPageLoad: PageFixture.Export['waitForPageLoad'] = async () => {
  await page.waitForSelector(appSelectors.mainPage.card.loading, { state: 'detached' })
}

// Add custom window.ethereum.request to wait for requests resolving
const initEthereumRequestsInterceptor = async () => {
  await page.evaluate(() => {
    if (!window.e2e) {
      window.e2e = {
        requestsQueue: [],
        waitForRequestsQueue: async () => {
          if (window.e2e.requestsQueue.length) {
            const promises = [ ...window.e2e.requestsQueue ]
            window.e2e.requestsQueue = []

            // Rpc requests could be rejected, so we need to use `allSettled` to wait all the queue
            await Promise.allSettled(promises)

            // After all requests has been resolved, it is possible that new requests would be added
            // to the requestsQueue soon. We need to resolve these requests as well until all of them
            // will be fetched and UI will be updated.
            // For example, we make a request to the contract when it is resolved we make some
            // calculations on the frontend, and then we make a new request again. To handle that, we
            // added a 250ms timeout, and waitForRequestsQueue() call after to it to make sure that
            // there is no other requests.
            await new Promise((resolve) => setTimeout(resolve, 250))
            await window.e2e.waitForRequestsQueue()
          }
        },
        originalRequest: window.ethereum.request,
      }

      window.ethereum.request = (data) => {
        const request = window.e2e.originalRequest(data)
        window.e2e.requestsQueue.push(request)

        return request
      }
    }
  })
}

const goTo = (store: StoreFixture.Export): PageFixture.Export['goTo'] => async (pathname: string) => {
  const url = `${process.env.APP_URL}${pathname}?${store.state.config.query}`

  await page.goto(url, { timeout: 20 * 1000 })

  await initEthereumRequestsInterceptor()

  return waitForPageLoad()
}

const refresh: PageFixture.Export['refresh'] = async (options) => {
  const result = await page.reload(options)

  await initEthereumRequestsInterceptor()

  return result
}

const waitForRpcRequests: PageFixture.Export['waitForRpcRequests'] = async () => {
  const queueLength = await page.evaluate(() => window.e2e.requestsQueue.length)

  if (queueLength) {
    await page.evaluate(async () => {
      await window.e2e.waitForRequestsQueue()
    })
  }
  else {
    // If the request has not yet managed to get into the queue, you will need to wait a little longer
    await page.waitForTimeout(100)
    await waitForRpcRequests()
  }
}

const routeAbort: PageFixture.Export['routeAbort'] = async (url: string) => {
  const isGraphql = /^[\w]+$/.test(url)
  const match = isGraphql ? new RegExp(`opname=${url}\\b`) : url

  const handler = (route: Route) => route.abort()

  await page.route(match, handler)

  return () => page.unroute(match, handler)
}

const checkBottomLoader: PageFixture.Export['checkBottomLoader'] = async ({ text, visible }) => {
  const bottomLoader = page.locator(appSelectors.bottomLoader, { hasText: text })

  if (visible) {
    await expect(bottomLoader).toBeVisible()
  }
  else {
    await expect(bottomLoader).not.toBeVisible()
  }
}

const checkNotification: PageFixture.Export['checkNotification'] = async (text: string) => {
  const notification = page.locator(appSelectors.notification, { hasText: text })

  await expect(notification).toBeVisible()
  await page.click(appSelectors.notificationCloseButton)
  await expect(notification).not.toBeVisible()
}

const getNumberValue: PageFixture.Export['getNumberValue'] = async (selector: string) => {
  const stringValue = await page.textContent(selector)

  if (stringValue) {
    // 10,000.05 ETH2 => 10,000.05
    const digitsValue = stringValue.replace(/\s\D.+/g, '')

    // 10,000.05 => 10000.05
    const numberValue = digitsValue.replace(/[^0-9.]/g, '')

    return parseFloat(numberValue)
  }

  return 0
}

const getCountNumberValue: PageFixture.Export['getCountNumberValue'] = async (selector: string) => {
  const value1 = await getNumberValue(selector)
  await page.waitForTimeout(100)
  const value2 = await getNumberValue(selector)

  if (value1 !== value2) {
    return getCountNumberValue(selector)
  }

  return value1
}

const checkStakingApr = (api: ApiFixture.Export): PageFixture.Export['checkStakingApr'] => async () => {
  const [
    aprValue,
    aprApiValue,
  ] = await Promise.all([
    page.getCountNumberValue(appSelectors.widgets.apr.value),
    api.getStakingApr(),
  ])

  expect(aprValue).toEqual(aprApiValue)
}

const changeNetwork = (props: { store: StoreFixture.Export, metaMask: MetaMaskFixture.Export }): PageFixture.Export['changeNetwork'] => async (network: StoreFixture.Network) => {
  const { store, metaMask } = props

  const networkSelector = network === 'gnosis'
    ? appSelectors.header.headerChangeNetworkGnosis
    : appSelectors.header.headerChangeNetworkEthereum

  await page.click(appSelectors.header.headerNetworkNameButton)
  await page.click(networkSelector)

  await metaMask.changeNetwork()

  store.setNetwork(network)

  await Promise.all([
    page.waitForRpcRequests(),
    page.waitForPageLoad(),
  ])

  await page.checkStakingApr()

  const networkName = await page.textContent(appSelectors.header.headerNetworkNameButton)
  const expectedNetworkName = network === 'gnosis' ? 'Gnosis' : 'Ethereum'

  expect(networkName).toEqual(expectedNetworkName)
}

const extendedPage: ExtendedTestFixture<PageFixture.Export> = async ({ browserContext, store, api, metaMask }, use) => {
  page = page || browserContext.pages()[0] as PageFixture.Export

  page.goTo = goTo(store)
  page.refresh = refresh
  page.routeAbort = routeAbort

  page.getNumberValue = getNumberValue
  page.getCountNumberValue = getCountNumberValue

  page.waitForPageLoad = waitForPageLoad
  page.waitForRpcRequests = waitForRpcRequests

  page.changeNetwork = changeNetwork({ store, metaMask })
  page.checkStakingApr = checkStakingApr(api)
  page.checkBottomLoader = checkBottomLoader
  page.checkNotification = checkNotification

  use(page)
}


export default extendedPage
