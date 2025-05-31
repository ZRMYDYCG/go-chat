/**
 * 错误处理中间件
 */
class CustomerError extends Error {
  payload = {
    code: 0,
    message: 'error',
  }
}
class ValidateError extends CustomerError {}
class DataError extends CustomerError {}

const formValidateErrorHandler = async (context, next) => {
  await next().catch((error) => {
    if(error instanceof CustomerError) {
      const { payload: { text: message, code } } = error
      // 表单校验类型错误处理
      context.body = {
        code,
        message,
      }
    } else {
      // 其他未处理类型错误处理
      const { message } = error
      context.body = {
        code: 0,
        message,
      }
    }
  })
}

const errorHandler = {
  ValidateError,
  DataError,
  formValidateErrorHandler
}

module.exports = errorHandler
