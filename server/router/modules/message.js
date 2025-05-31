const Router = require('koa-router')
const tokenAuth = require('../../middleware/tokenAuth')
const messageController = require('../../controller/message')

const messageRouter = new Router({
  prefix: '/message'
})

// 需要做tokenAuth等中间件验证的路由放在此处下面定义，否则在上面定义
messageRouter.use(tokenAuth)

// 获取聊天消息列表
messageRouter.get('/list', messageController.list)

// 操作-删除聊天消息
// messageRouter.delete('/delete', messageController.delete)

// 设置为已读
// messageRouter.patch('/read', messageController.read)


module.exports = messageRouter
