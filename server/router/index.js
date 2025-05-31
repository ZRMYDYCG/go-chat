const fs = require('fs')
const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1'
})

fs.readdirSync(`${__dirname}/modules`).forEach((file) => {
  const module = require(`./modules/${file}`)
  router.use(module.routes())
})

module.exports = router