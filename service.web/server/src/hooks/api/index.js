const fs = require('fs')

const hooks = {}
const dir = fs.readdirSync(__dirname)

dir.forEach((path) => {
  const fullPath = `${__dirname}/${path}`
  if (!fs.lstatSync(fullPath).isDirectory() && !path.includes('index')) {
    const name = path.split('.')[0].trim()
    hooks[name] = require(fullPath)
  }
})

module.exports = hooks
