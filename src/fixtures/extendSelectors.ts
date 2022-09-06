import { selectors } from '@playwright/test'


(async () => {
  await selectors.register('tid', () => {
    /*
      initial selector value contains value that's going after tid=
      for
      await page.click('tid=someModal tid=someContainer:nth-child(1)')
      selector's value will be
      someModal tid=someContainer:nth-child(1)
    */
    const modifySelector = (selector: string) => {
      const value = selector.replace(/tid=/, '')

      return `[data-testid=${value}]`
    }

    return {
      query(root: Document, selector: string) {
        return root.querySelector(modifySelector(selector))
      },
      queryAll(root: Document, selector: string) {
        return Array.from(root.querySelectorAll(modifySelector(selector)))
      },
    }
  })
})()
