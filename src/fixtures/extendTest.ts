import { test as base } from '@playwright/test'
import type { TestFixture, BrowserContext } from '@playwright/test'

import api from './util/api'
import store from './util/store'
import hardhat from './util/hardhat'
import metaMask from './util/metaMask'
import { browserContext, extendedPage } from './util/playwright'


type ExtendedTest = {
  api: ApiFixture.Export
  page: PageFixture.Export
  store: StoreFixture.Export
  hardhat: HardhatFixture.Export
  metaMask: MetaMaskFixture.Export
  browserContext: BrowserContext
}

export type ExtendedTestArgs = ExtendedTest

export type ExtendedTestFixture<
  Fixture = () => Promise<void>,
  AdditionalArgs = {}
> = TestFixture<
  Fixture,
  ExtendedTestArgs & AdditionalArgs
>

// ATTN order is important, fixtures that use another fixtures must be placed below them
export const test = base.extend<ExtendedTest>({
  store,
  api,
  page: extendedPage,
  hardhat,
  browserContext,
  metaMask,
})
