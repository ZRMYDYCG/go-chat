const Router = require('koa-router')
const tokenAuth = require('../../middleware/tokenAuth')
const userController = require('../../controller/user')

const userRouter = new Router({
  prefix: '/user'
})

// 注册用户
userRouter.post('/register', userController.register)

// 用户登录
userRouter.post('/login', userController.login)

// 需要做tokenAuth等中间件验证的路由放在此处下面定义，否则在上面定义
userRouter.use(tokenAuth)

// 上传用户图像
userRouter.patch('/uploadAvater', userController.uploadAvater)

// 更新用户信息
userRouter.patch('/updateInfo', userController.updateInfo)

// 搜索用户列表
userRouter.get('/searchUser', userController.searchUser)

module.exports = userRouter