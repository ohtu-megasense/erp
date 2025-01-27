const logger = require('./logger')

const requestLogger = (request, _response, next) => {
  logger.info('Method', request.method)
  logger.info('Path', request.path)
  logger.info('Body', request.body)
  logger.info('***')
  next()
}
module.exports = {
  requestLogger
}
