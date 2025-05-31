require('../config')
const Koa = require('koa')
require('./socket')
const path = require('path')
const KoaBody = require('koa-body')
const router = require('../router')
const {
  formValidateErrorHandler: formValidateErrorHandlerMiddleware
} = require('../middleware/errorHandler')

const serveStatic = require('koa-static');
const mount = require('koa-mount');


const app = new Koa()

app.use(
  KoaBody.default({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../upload'),
      keepExtensions: true,
    },
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    returnRawBody: true
  })
)

// 统一错误处理
app.use(formValidateErrorHandlerMiddleware)

// 注册路由
app.use(router.routes())

// 静态资源访问
app.use(mount('/upload', serveStatic(path.join(__dirname, '../upload'))))

module.exports = app
