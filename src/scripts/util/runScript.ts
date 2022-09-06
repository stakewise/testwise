import path from 'path'


const runScript = (command: string) => {
  const commandPath = command.replace(/^run=/, '')
  const scriptPath = path.resolve(__dirname, '../', commandPath)

  if (scriptPath) {
    try {
      const script = require(scriptPath)

      if (script) {
        script.default()
      }
    }
    catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error(`Script "${scriptPath}" not found`)
      }
      else {
        console.error(error)
      }
    }
  }
  else {
    console.error('Empty path')
  }
}


export default runScript
