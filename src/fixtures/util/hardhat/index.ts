import { formatEther, parseEther } from 'ethers/lib/utils'
import type { BigNumber } from 'ethers'

import { startHardhat } from 'scripts/util'

import type { ExtendedTestFixture } from 'fixtures/extendTest'


const hre = require('hardhat')


let store: StoreFixture.Export
let hardhatPromise: Promise<void> | undefined

const resolve: HardhatFixture.Export['resolve'] = () => {
  hardhatPromise = hardhatPromise || startHardhat()

  return hardhatPromise
}

const formatBalance = (balance?: BigNumber) => balance ? Number(formatEther(balance)) : 0

const fetchBalances = async (props: { address: string, store: StoreFixture.Export }) => {
  const { address, store } = props

  const [
    depositToken,
    stakedToken,
    rewardToken,
    swiseToken,
    nativeToken,
  ] = await Promise.all([
    store.state.contracts.tokens.default.depositTokenContract.balanceOf(address).then(formatBalance),
    store.state.contracts.tokens.default.stakedTokenContract.balanceOf(address).then(formatBalance),
    store.state.contracts.tokens.default.rewardTokenContract.balanceOf(address).then(formatBalance),
    store.state.contracts.tokens.default.swiseTokenContract.balanceOf(address).then(formatBalance),
    hre.ethers.provider.getBalance(address).then(formatBalance),
  ])

  return {
    depositToken,
    stakedToken,
    rewardToken,
    swiseToken,
    nativeToken,
  }
}

const getBalances: HardhatFixture.Export['getBalances'] = async () => {
  await Promise.all(
    Object.keys(store.state.accounts).map((address) => {
      return fetchBalances({ address, store })
        .then((balances) => store.setBalances(address, balances))
        .catch((error) => console.error('Error fetch balances', error))
    })
  )
}

const impersonateAccount = async (address: string) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [ address ],
  })
}

const stopImpersonateAccount = async (address: string) => {
  await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [ address ],
  })
}

// TODO check whats going on here
const addToken = async (addressToAdd: string, tokenHolder: string) => {
  const signerAddress = Object.keys(store.state.accounts)
    .find((address) => address !== addressToAdd) as string

  const signer = await hre.ethers.provider.getSigner(signerAddress)

  await signer.sendTransaction({
    to: tokenHolder,
    value: parseEther('1'),
  })
}

const addRewardToken: HardhatFixture.Export['addRewardToken'] = async (amount: number, address?: string) => {
  const provider = hre.ethers.provider
  const currentAddress = address || store.state.account.address

  if (!currentAddress) {
    console.error('Current address is null')
    return
  }

  const rewardTokenHolder = store.state.config.addresses.holders.rewardToken
  await addToken(currentAddress, rewardTokenHolder)

  const signer = provider.getSigner(rewardTokenHolder)
  const contract = store.state.contracts.tokens.default.rewardTokenContract.connect(signer)

  await impersonateAccount(rewardTokenHolder)
  await contract.transfer(currentAddress, parseEther(amount.toString()), { from: rewardTokenHolder })
  await stopImpersonateAccount(rewardTokenHolder)

  await getBalances()
}

const addDepositToken: HardhatFixture.Export['addDepositToken'] = async (amount: number, address?: string) => {
  const provider = hre.ethers.provider
  const currentAddress = address || store.state.account.address

  if (!currentAddress) {
    console.error('Current address is null')
    return
  }

  // @ts-ignore
  const depositTokenHolder = store.state.config.addresses.holders.depositToken
  await addToken(currentAddress, depositTokenHolder)

  const signer = provider.getSigner(depositTokenHolder)
  const contract = store.state.contracts.tokens.default.depositTokenContract.connect(signer)

  await impersonateAccount(depositTokenHolder)
  await contract.transfer(currentAddress, parseEther(amount.toString()), { from: depositTokenHolder })
  await stopImpersonateAccount(depositTokenHolder)

  await getBalances()
}

const resetNetwork: HardhatFixture.Export['resetNetwork'] = async (network) => {
  await resolve()

  await hre.network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: network === 'gnosis'
            ? process.env.GNOSIS_RPC_URL
            : process.env.MAINNET_RPC_URL,
        },
      },
    ],
  })

  const newNetwork = network || 'mainnet'

  store.setNetwork(newNetwork)

  await getBalances()
}

const hardhatActions: ExtendedTestFixture<HardhatFixture.Export> = ({ store: storeFixture }, use) => {
  store = store || storeFixture

  resolve()

  use({
    resolve,
    resetNetwork,

    getBalances,
    addDepositToken,
    addRewardToken,
  })
}


export default hardhatActions
