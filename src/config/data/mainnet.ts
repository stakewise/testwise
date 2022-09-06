import { WETH9 } from '@uniswap/sdk-core'

import { getNetworkQuery } from '../helpers'


const chainId = 1

export default {
  network: 'mainnet',
  query: getNetworkQuery('mainnet'),
  // TODO add tests for minimal APR
  settings: {
    minimalAPR: 3.5,
    maintainerFee: 1000,
    rewardUniswapFee: 500,
  },
  addresses: {
    tokens: {
      default: {
        swise: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
        staked: '0xFe2e637202056d30016725477c5da089Ab0A043A',
        reward: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
        deposit: WETH9[chainId].address,
        alternativeDeposit: '',
      },
      special: {
        dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      },
    },
    base: {
      pool: '0xC874b064f465bdD6411D45734b56fac750Cda29A',
      oracles: '0x2f1C5E86B13a74f5A6E7B4b35DD77fe29Aa47514',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      merkleDrop: '0x2AAB6822a1a9f982fd7b0Fe35A5A5b6148eCf4d5',
      whiteListManager: '',
      merkleDistributor: '0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20',
      vestingEscrowFactory: '0x7B910cc3D4B42FEFF056218bD56d7700E4ea7dD5',
      soloPaymentsRecipient: '0x51a5b4aD57255ebC52d7377e288998C16B3c3C04',
    },
    holders: {
      rewardToken: '0xf91AA4a655B6F43243ed4C2853F3508314DaA2aB',
      stakedToken: '0x0ae1931832a3974c6d5139cf794d6d86cf000bfb',
    },
  },
} as const
