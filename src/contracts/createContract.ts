import type { ContractInterface } from '@ethersproject/contracts'

const hre = require('hardhat')


const createContract = <T extends unknown>(address: string, abi: ContractInterface): T => {
  const provider = hre.ethers.provider

  return new hre.ethers.Contract(address, abi, provider)
}


export default createContract
