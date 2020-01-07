const fs = require('fs')

const models = {}
const dir = fs.readdirSync(__dirname)

dir.forEach((path) => {
  const fullPath = `${__dirname}/${path}`
  if (!fs.lstatSync(fullPath).isDirectory() && !path.includes('index')) {
    const name = path.split('.')[0].trim()
    models[name] = require(fullPath)
  }
})

module.exports = models
