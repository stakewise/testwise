import { WETH9 } from '@uniswap/sdk-core'

import { getNetworkQuery } from '../helpers'


const chainId = 1

export default {
  network: 'harbourMainnet',
  query: getNetworkQuery('harbourMainnet'),
  // TODO add tests for minimal APR
  settings: {
    minimalAPR: 3.5,
    maintainerFee: 800,
    rewardUniswapFee: 0,
  },
  addresses: {
    tokens: {
      default: {
        swise: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
        staked: '0x65077fA7Df8e38e135bd4052ac243F603729892d',
        reward: '0xCBE26dbC91B05C160050167107154780F36CeAAB',
        deposit: WETH9[chainId].address,
        alternativeDeposit: '',
      },
      special: {
        dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      },
    },
    base: {
      pool: '0xeA6b7151b138c274eD8d4D61328352545eF2D4b7',
      oracles: '0x16c0020fC507C675eA8A3A817416adA3D95c661b',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      merkleDrop: '',
      whiteListManager: '0x57a9cbED053f37EB67d6f5932b1F2f9Afbe347F3',
      merkleDistributor: '0x07E8291591eaC73Dd93b079e3E68e171094bA9e1',
      vestingEscrowFactory: '0x7B910cc3D4B42FEFF056218bD56d7700E4ea7dD5',
      soloPaymentsRecipient: '',
    },
    holders: {
      rewardToken: '0xf91AA4a655B6F43243ed4C2853F3508314DaA2aB',
      stakedToken: '0x06920C9fC643De77B99cB7670A944AD31eaAA260',
      whiteList: '0x6C7692dB59FDC7A659208EEE57C2c876aE54a448',
    },
  },
} as const
