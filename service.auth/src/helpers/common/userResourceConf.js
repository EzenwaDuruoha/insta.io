module.exports = (ext = {}) => {
  const defaults = {
    args: {
      or: [
        {path: 'data', value: 'username'},
        {path: 'data', value: 'email'},
        {path: 'data', value: 'id'},
        {path: 'params', value: 'id'}
      ],
    },
    service: 'userDataLayer',
    call: 'getUser',
    hydrate: (data) => {
      let q = data.or
      if (q) {
        q = q[0]
      }
      if (!q) {
        q = data.and
      }
      if (!q) {
        q = data
      }
      if (!Array.isArray(q)) {
        q = [q]
      }
      return [...q, {
        relations: ['profile', 'settings']
      }]
    }
  }
  return Object.assign(defaults, ext)
}
