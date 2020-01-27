const setupSourceRequest = (hooks) => {
    const {config, context, request} = hooks.getFrame()
    const {device: {type, name = '', parser: { useragent } }} = hooks.getRequest()
    const sourceRequest = {
      useragent,
      env: config.env,
      device: type,
      userServiceUrl: config.network.userServiceUrl,
      mediaServiceUrl: config.network.mediaServiceUrl,
      deviceName: name
    }
    hooks.setFrame({context: {...context, sourceRequest}})
}

module.exports = setupSourceRequest
