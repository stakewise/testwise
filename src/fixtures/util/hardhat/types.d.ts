declare namespace HardhatFixture {

  type Export = {
    resolve: () => Promise<void>
    resetNetwork: (network?: StoreFixture.Network) => Promise<void>

    getBalances: () => Promise<void>
    addRewardToken: (amount: number, address?: string) => Promise<void>
    addDepositToken: (amount: number, address?: string) => Promise<void>
  }
}
