require('./bootstrap')
require('dotenv').config()

const runScript = require('./util/runScript').default


const isScript = process.argv.some((arg) => /^run=/.test(arg))

if (isScript) {
  const command = process.argv.find((arg) => /^run=/.test(arg))

  runScript(command)
}
