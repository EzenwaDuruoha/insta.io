const setupSourceRequest = (hooks) => {
    const {config, request} = hooks.getFrame()
    const {device: {type, name = '', parser: { useragent } }} = hooks.getRequest()
    const sourceRequest = {
      useragent,
      env: config.env,
      device: type,
      deviceName: name
    }
    hooks.setFrame({context: {sourceRequest}})
}

module.exports = setupSourceRequest
