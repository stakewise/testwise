import { getAddress } from '@ethersproject/address'
import { getConfig } from 'config'
import { createContracts } from 'contracts'

import type { ExtendedTestFixture } from 'fixtures/extendTest'


const mainnetConfig = getConfig('mainnet')

const defaultBalances = {
  nativeToken: 10000,
}

const state: StoreFixture.State = {
  config: mainnetConfig,
  contracts: createContracts(mainnetConfig),
  account: {
    address: null,
    balances: {},
  },
  // TODO move to some config data?
  accounts: {
    [getAddress('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')]: {
      id: 'account_1',
      balances: defaultBalances,
    },
    [getAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')]: {
      id: 'account_2',
      balances: defaultBalances,
    },
  },
}

const setAddress: StoreFixture.Actions['setAddress'] = (address) => {
  if (address) {
    const formattedAddress = getAddress(address)

    state.account.address = formattedAddress
    state.account.balances = state.accounts[formattedAddress].balances
  }
  else {
    state.account.address = null
  }
}

const setBalances: StoreFixture.Actions['setBalances'] = (address, balances) => {
  state.accounts[address].balances = balances

  if (state.account.address === address) {
    state.account.balances = balances
  }
}

const setNetwork: StoreFixture.Actions['setNetwork'] = (network) => {
  state.config = getConfig(network)
  state.contracts = createContracts(state.config)
}

const store: ExtendedTestFixture<StoreFixture.Export> = async ({}, use) => {

  use({
    state,
    setAddress,
    setNetwork,
    setBalances,
  })
}


export default store
