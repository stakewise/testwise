import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from 'ethers/lib/utils'

import formatTokenValue from './formatTokenValue'


class Balance {
  value: BigNumber

  constructor(initialValue: number) {
    this.value = parseEther(String(initialValue))
  }

  set(value: number) {
    this.value = parseEther(String(value))
  }

  add(value: number) {
    const valueToAdd = parseEther(String(value))

    // console.log({
    //   value: formatEther(this.value),
    //   add: value,
    //   result: formatEther(this.value.add(valueToAdd)),
    // })

    this.value = this.value.add(valueToAdd)
  }

  remove(value: number) {
    const valueToRemove = parseEther(String(value))

    // console.log({
    //   value: formatEther(this.value),
    //   add: value,
    //   result: formatEther(this.value.sub(valueToRemove)),
    // })

    this.value = this.value.sub(valueToRemove)
  }

  getShort() {
    const formattedValue = formatTokenValue({
      value: formatEther(this.value),
      withSeparator: false,
    })

    return Number(formattedValue)
  }
}


export default Balance
