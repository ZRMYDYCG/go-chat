const Router = require('koa-router')
const tokenAuth = require('../../middleware/tokenAuth')
const chatController = require('../../controller/chat')

const chatRouter = new Router({
  prefix: '/chat'
})

// 需要做tokenAuth等中间件验证的路由放在此处下面定义，否则在上面定义
chatRouter.use(tokenAuth)

// 获取聊天列表
chatRouter.get('/list', chatController.list)

// 添加聊天
chatRouter.post('/create', chatController.create)

// 操作-删除聊天
chatRouter.delete('/delete', chatController.delete)

module.exports = chatRouter
