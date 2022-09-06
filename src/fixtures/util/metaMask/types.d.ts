declare namespace MetaMaskFixture {

  type ConfirmResult = {
    gas: number
    maxAmount: number
  }

  type GiveAccessResult = {
    shortAddress: string
  }

  type SignAndConfirmResult = ConfirmResult & {
    wasSigned: boolean
  }

  type GiveAccessAndConfirmResult = ConfirmResult & GiveAccessResult

  type Export = {
    unlock: () => Promise<boolean>
    confirm: () => Promise<ConfirmResult>
    resetAccount: () => Promise<void>
    changeAccount: (account: string) => Promise<void>
    changeNetwork: () => Promise<void>
    approveConnect: () => Promise<void>
    signAndConfirm: () => Promise<SignAndConfirmResult>
    giveAccessAndConfirm: () => Promise<GiveAccessAndConfirmResult>
  }
}
