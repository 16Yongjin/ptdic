const fs = require('mz/fs')

const appendLog = entry =>
  fs.appendFile('notFoundDictLogger.log', `${entry}\n`).then(() => {
    console.log(`Appended not found entry: ${entry}`)
  })

module.exports = { appendLog }
