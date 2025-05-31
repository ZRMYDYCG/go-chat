const Router = require('koa-router')
const tokenAuth = require('../../middleware/tokenAuth')
const contactController = require('../../controller/contact')

const contactRouter = new Router({
  prefix: '/contact'
})

// 需要做tokenAuth等中间件验证的路由放在此处下面定义，否则在上面定义
contactRouter.use(tokenAuth)

// 获取联系人列表
contactRouter.get('/list', contactController.list)

// 添加联系人（好友）
contactRouter.post('/create', contactController.create)

// 联系人资料设置
contactRouter.patch('/setInfo', contactController.setInfo)

// 操作-删除联系人
contactRouter.delete('/delete', contactController.delete)


module.exports = contactRouter
