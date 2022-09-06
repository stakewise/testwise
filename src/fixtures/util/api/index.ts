import { expect, request } from '@playwright/test'

import type { ExtendedTestFixture } from 'fixtures/extendTest'


const requestContext = request.newContext({
  baseURL: process.env.API_URL,
})

const getStakingApr = (store: StoreFixture.Export): ApiFixture.Export['getStakingApr'] => async () => {
  const fetch = await requestContext
  const response = await fetch.get(`/pool-stats/?network=${store.state.config.network}`)

  expect(response.ok()).toBeTruthy()

  const aprNumber = JSON.parse(await response.text()).validators_apr
  const apr = aprNumber * 90 / 100

  return Math.trunc(apr * 100) / 100
}

const api: ExtendedTestFixture<ApiFixture.Export> = async ({ store }, use) => {

  use({
    getStakingApr: getStakingApr(store),
  })
}


export default api
