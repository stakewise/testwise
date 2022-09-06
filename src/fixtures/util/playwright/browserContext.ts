import fs from 'fs-extra'
import path from 'path'
import unzip from 'unzip-stream'
import { BrowserContext, chromium } from '@playwright/test'

import { ExtendedTestFixture } from 'fixtures/extendTest'


const rootPath = path.resolve(__dirname, '../../../../')
const tmpPath = path.join(rootPath, 'tmp')
const allureResultsPath = path.join(rootPath, 'allure-results')
const playwrightResultsPath = path.join(rootPath, 'playwright-results')

const archives = {
  chromeProfile: {
    from: path.join(rootPath, 'profiles/chrome_profile.zip'),
    to: tmpPath,
  },
  metaMaskPlugin: {
    from: path.join(rootPath, 'profiles/metaMask-plugin-10.12.1.zip'),
    to: path.resolve(tmpPath, 'plugins/metaMask-10.12.1'),
  },
}

const clearDir = (dirPath: string) => {
  const isTmpDirExist = fs.existsSync(dirPath)

  if (isTmpDirExist) {
    fs.removeSync(dirPath)
  }

  fs.mkdir(dirPath)
}

let context: BrowserContext | null = null

const unzipFile = (filePath: string, extractPath: string) => (
  new Promise((resolve) => {
    const stream = fs.createReadStream(filePath)
    stream.pipe(unzip.Extract({ path: extractPath }))
    stream.on('end', () => resolve(null))
  })
)

const browserContext: ExtendedTestFixture<BrowserContext> = async ({}, use) => {
  if (!context) {
    clearDir(tmpPath)
    clearDir(allureResultsPath)
    clearDir(playwrightResultsPath)

    await Promise.all([
      unzipFile(archives.chromeProfile.from, archives.chromeProfile.to),
      unzipFile(archives.metaMaskPlugin.from, archives.metaMaskPlugin.to),
    ])

    context = await chromium.launchPersistentContext(tmpPath, {
      // headless: false,
      args: [
        `--disable-extensions-except=${archives.metaMaskPlugin.to}`,
        `--load-extension=${archives.metaMaskPlugin.to}`
      ]
    })
  }

  await use(context)
}


export default browserContext
