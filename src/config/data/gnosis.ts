import { getNetworkQuery } from '../helpers'


export default {
  network: 'gnosis',
  query: getNetworkQuery('gnosis'),
  // TODO add tests for minimal APR
  settings: {
    minimalAPR: 8,
    rewardUniswapFee: 0,
    maintainerFee: 1000,
  },
  addresses: {
    tokens: {
      default: {
        swise: '0xfdA94F056346d2320d4B5E468D6Ad099b2277746',
        staked: '0xA4eF9Da5BA71Cc0D2e5E877a910A37eC43420445',
        reward: '0x6aC78efae880282396a335CA2F79863A1e6831D4',
        deposit: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
        alternativeDeposit: '0x722fc4DAABFEaff81b97894fC623f91814a1BF68',
      },
      special: {
        dai: '',
        steth: '',
      },
    },
    base: {
      pool: '0x2f99472b727e15EECf9B9eFF9F7481B85d3b4444',
      oracles: '0xa6D123620Ea004cc5158b0ec260E934bd45C78c1',
      multicall: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
      merkleDrop: '',
      whiteListManager: '',
      merkleDistributor: '0x7dc30953CE236665d032329F6a922d67F0a33a2B',
      vestingEscrowFactory: '',
      soloPaymentsRecipient: '',
    },
    holders: {
      rewardToken: '0x53811010085382D49eF12bCC55902bbFCEB57790',
      depositToken: '0x458cD345B4C05e8DF39d0A07220feb4Ec19F5e6f', // Gno
      alternativeDepositTokenContract: '0x6b504204a85E0231b1a1B1926B9264939F29c65e', // mGno
    }
  },
} as const
