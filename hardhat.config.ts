import '@nomiclabs/hardhat-waffle'

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      forking: {
        url: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
      }
    },
  },
  throwOnTransactionFailures: true
}
