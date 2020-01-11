class BaseModel {
  static create (args = {}) {
    const Model = this
    const m = new Model()
    return Object.assign(m, args)
  }

  toJSON (excludes = []) {
    return Object.keys(this).reduce((reducer, key) => {
      if (!excludes.includes(key)) {
        reducer[key] = this[key]
      }
      return reducer
    }, {})
  }

  update (args = {}) {
    if (typeof args !== 'object') throw new Error('Argument must be an object')
    Object.keys(args).forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = args[property]
      }
    })
    delete this.last_update
  }
}

module.exports = BaseModel
