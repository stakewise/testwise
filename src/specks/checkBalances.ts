import { expect, ExtendedTestFixture } from 'fixtures'
import { appSelectors, Balance } from 'helpers'


const getShort = (balance: number) => Math.trunc(balance * 10000) / 10000

type CheckBalancesProps = {
  rewardTokenBalance?: Balance,
  stakedTokenBalance: Balance,
}

export type CheckBalances = (props: CheckBalancesProps) => Promise<void>

const checkBalances: ExtendedTestFixture<CheckBalances> = async ({ store, page, hardhat }, use) => {
  await use(async ({ rewardTokenBalance, stakedTokenBalance }) => {
    await hardhat.getBalances()

    const [
      stakedTokenAmount,
      rewardTokenAmount,
    ] = await Promise.all([
      page.getCountNumberValue(appSelectors.widgets.staking.amount),
      page.getCountNumberValue(appSelectors.widgets.rewards.amount),
    ])

    // TODO remove if the error won't be reproduced again
    const isRewardTokenError = rewardTokenBalance && rewardTokenAmount !== rewardTokenBalance.getShort()
    const isStakedTokenError = stakedTokenAmount !== stakedTokenBalance.getShort()

    if (isRewardTokenError || isStakedTokenError) {
      console.log(store.state.account.balances)

      await hardhat.getBalances()
      console.log(store.state.account.balances)

      await page.waitForTimeout(100000)
    }

    if (rewardTokenBalance) {
      // Check UI balances with calculated manually
      expect(rewardTokenAmount).toEqual(rewardTokenBalance.getShort())
      // Check UI balances with hardhat values
      expect(rewardTokenAmount).toEqual(getShort(store.state.account.balances.rewardToken as number))
    }

    expect(stakedTokenAmount).toEqual(stakedTokenBalance.getShort())
    expect(stakedTokenAmount).toEqual(getShort(store.state.account.balances.stakedToken as number))
  })
}


export default checkBalances
