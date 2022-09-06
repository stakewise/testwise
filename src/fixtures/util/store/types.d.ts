import { getConfig } from 'config'
import { createContracts } from 'contracts'


global {

  namespace StoreFixture {

    type Network = 'mainnet' | 'gnosis' | 'harbourMainnet'

    type Balances = Record<string, number | undefined>

    type State = {
      config: ReturnType<typeof getConfig>
      contracts: ReturnType<typeof createContracts>
      account: {
        address: string | null
        balances: Balances
      }
      accounts: Record<string, {
        id: string
        balances: Balances
      }>
    }

    type Actions = {
      setAddress: (address: string | null) => void
      setNetwork: (network: Network) => void
      setBalances: (address: string, balances: Balances) => void
    }

    type Export = Actions & {
      state: State
    }
  }
}
