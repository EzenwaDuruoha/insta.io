/**
 *
 * @param {ClassDecorator} objClass
 * @param {Array<String>} otherMethodsToIgnore
 */
module.exports.bindMethodsToSelf = function (objClass, otherMethodsToIgnore = []) {
  const self = this
  Object.getOwnPropertyNames(objClass.prototype)
    .forEach(method => {
      if (method === 'constructor') return
      // any other methods you don't want bound to self
      if (otherMethodsToIgnore.indexOf(method) > -1) return
      // bind all other methods to class instance
      self[method] = self[method].bind(self)
    })
}
