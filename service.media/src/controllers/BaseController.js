class BaseController {
  get (req, res, next) {
    return res.status(404).json({
      status: 'error',
      data: 'Not Found',
      code: 404
    })
  }

  update (req, res, next) {
    return res.status(404).json({
      status: 'error',
      data: 'Not Found',
      code: 404
    })
  }

  create (req, res, next) {
    return res.status(404).json({
      status: 'error',
      data: 'Not Found',
      code: 404
    })
  }

  delete (req, res, next) {
    return res.status(404).json({
      status: 'error',
      data: 'Not Found',
      code: 404
    })
  }

  query (req, res, next) {
    return res.status(404).json({
      status: 'error',
      data: 'Not Found',
      code: 404
    })
  }
}
module.exports = BaseController
