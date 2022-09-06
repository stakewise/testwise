import { getConfig } from '../config'

import {
  Erc20Abi,
  SwiseTokenAbi,
  StakedEthTokenAbi,
  RewardEthTokenAbi,
  WhiteListManagerAbi,
} from './abis'

import type {
  WhiteListManagerAbi as WhiteListManagerType,
  StakedEthTokenAbi as StakedEthTokenType,
  RewardEthTokenAbi as RewardEthTokenType,
  SwiseTokenAbi as SwiseTokenType,
  Erc20Abi as Erc20Type,
} from './types'

import createContract from './createContract'


type Config = ReturnType<typeof getConfig>

const getStakedEthTokenContract = (config: Config) => createContract<StakedEthTokenType>(
  config.addresses.tokens.default.staked,
  StakedEthTokenAbi
)

const getRewardEthTokenContract = (config: Config) => createContract<RewardEthTokenType>(
  config.addresses.tokens.default.reward,
  RewardEthTokenAbi
)

const getSwiseTokenContract = (config: Config) => createContract<SwiseTokenType>(
  config.addresses.tokens.default.swise,
  SwiseTokenAbi
)

const getDepositTokenContract = (config: Config) => createContract<Erc20Type>(
  config.addresses.tokens.default.deposit,
  Erc20Abi
)

const getAlternativeDepositTokenContract = (config: Config) => createContract<Erc20Type>(
  config.addresses.tokens.default.alternativeDeposit,
  Erc20Abi
)

const getWhiteListManagerContract = (config: Config) => createContract<WhiteListManagerType>(
  config.addresses.base.whiteListManager,
  WhiteListManagerAbi
)

const getDaiTokenContract = (config: Config) => createContract<Erc20Type>(
  config.addresses.tokens.special.dai,
  Erc20Abi
)

const getStethTokenContract = (config: Config) => createContract<Erc20Type>(
  config.addresses.tokens.special.steth,
  Erc20Abi
)

export const createContracts = (config: Config) => {

  return {
    base: {
      whiteListManagerContract: getWhiteListManagerContract(config),
    },
    tokens: {
      default: {
        swiseTokenContract: getSwiseTokenContract(config),
        depositTokenContract: getDepositTokenContract(config),
        stakedTokenContract: getStakedEthTokenContract(config),
        rewardTokenContract: getRewardEthTokenContract(config),
        alternativeDepositTokenContract: getAlternativeDepositTokenContract(config),
      },
      special: {
        daiTokenContract: getDaiTokenContract(config),
        stethTokenContract: getStethTokenContract(config),
      },
    },
  }
}


export default createContracts
