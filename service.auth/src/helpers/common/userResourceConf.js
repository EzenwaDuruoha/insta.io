module.exports = (ext = {}) => {
  const defaults = {
    args: [
      {path: 'data', value: 'username'},
      {path: 'data', value: 'email'}
    ],
    service: 'userDataLayer',
    call: 'getUser',
    hydrate: (data) => {
      const o = Object.keys(data).reduce((r, k) => {
        if (data[k]) {
          r.push({[k]: data[k]})
        }
        return r
      }, [])
      return [o, {
        relations: ['profile', 'settings']
      }]
    }
  }
  return Object.assign(defaults, ext)
}
