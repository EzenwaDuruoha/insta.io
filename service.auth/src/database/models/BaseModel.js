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
}

module.exports = BaseModel
