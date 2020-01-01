module.exports.isValidString = function (str) {
  return (typeof str === 'string' && str.length !== 0 && !!str.trim())
}
