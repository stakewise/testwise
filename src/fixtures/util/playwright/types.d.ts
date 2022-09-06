import { Page } from '@playwright/test'


global {
  declare namespace PageFixture {

    type Export = Page & {
      goTo: (pathname: string) => Promise<void>
      refresh: Page['reload']
      routeAbort: (url: string) => Promise<() => void>

      getNumberValue: (selector: string) => Promise<number>
      getCountNumberValue: (selector: string) => Promise<number>

      waitForPageLoad: () => Promise<void>
      waitForRpcRequests: () => Promise<void>

      changeNetwork: (network: StoreFixture.Network) => Promise<void>
      checkStakingApr: () => Promise<void>
      checkBottomLoader: (props: { text: string, visible: boolean }) => Promise<void>
      checkNotification: (text: string) => Promise<void>
    }
  }
}
