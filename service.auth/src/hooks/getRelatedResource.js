module.exports = function (params = {}, meta = {}) {
  const {args = [], service = '', call = '', hydrate = null} = params
  const {spreadArgs = false, identifier = '', passPath = null} = meta

  return async (hooks) => {
    const frame = hooks.getFrame()
    const context = hooks.getContext()
    const {dependencies, relatedResources} = frame

    try {
      if (!args || !service || !call || !Array.isArray(args)) throw new Error('Invalid {args or service or call} Value')
      const handler = dependencies[service]
      if (!handler) throw new Error(`[${service}] Doesn't Exist in Dependency list`)
      if (!handler[call] || typeof handler[call] !== 'function') throw new Error(`${call} is not a method on ${service}`)

      let resource = null
      let foundArgs = null

      if (passPath) {
        if (!frame[passPath]) throw new Error(`[${passPath}] not found in frame`)
        foundArgs = frame[passPath]
      } else {
        foundArgs = args.reduce((r, conf) => {
          const {path, value} = conf
          if (!path || !value) throw new Error('Invalid path/value in args')
          const store = frame[path]
          if (!store) throw new Error(`[ ${path} ] Doesn't Exist in Frame`)
          r[value] = store[value]
          return r
        }, {})
      }

      if (typeof hydrate === 'function') {
        foundArgs = await hydrate(foundArgs)
      }

      if (spreadArgs) {
        resource = await handler[call](...foundArgs)
      } else {
        resource = await handler[call](foundArgs)
      }

      hooks.setFrame({relatedResources: {...relatedResources, [identifier]: resource}})
    } catch (error) {
      context.complete(error)
    }
  }
}