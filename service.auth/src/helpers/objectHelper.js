module.exports.bindMethodsToSelf = function (objClass, excludes = []) {
  const self = this
  Object.getOwnPropertyNames(objClass.prototype)
    .forEach((method) => {
      if (method === 'constructor') return
      if (excludes.includes(method)) return
      self[method] = self[method].bind(self)
    })
}
