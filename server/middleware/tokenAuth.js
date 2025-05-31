/**
 * 用户登录与否token验证中间件
 */
const { verify } = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/app')
const { ValidateError, DataError } = require('../middleware/errorHandler')

const tokenAuth = async (context, next) => {
  const { authorization: token } = context.request.header

  if (!token) {
    let message = 'token值缺失'
    let error = new ValidateError(message)
    error.payload = {
      code: 100901001,
      text: message
    }
    throw error
  }

  try {
    const user = verify(token, JWT_SECRET)
    context.state.user = user
  } catch ({ name }) {
    if (name === 'TokenExpiredError') {
        let message = 'token已过期'
        let error = new DataError(message)
        error.payload = {
          code: 100901002,
          text: message
        }
        throw error
    } else if (name === 'JsonWebTokenError') {
        let message = '无效的token'
        let error = new DataError(message)
        error.payload = {
          code: 100901003,
          text: message
        }
        throw error
    }
  }
  await next()
}

module.exports = tokenAuth