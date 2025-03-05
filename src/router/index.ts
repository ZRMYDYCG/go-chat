import { useUserStore } from '@/store/modules/user'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

/**
 * 创建路由器
 * */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

/**
 * 全局前置守卫
 * * * whiteRoutes 白名单路由
 * */
const whiteRoutes = ['/register', '/login', '/404']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const { token } = userStore
  if (!whiteRoutes.includes(to.path) && token === '') {
    next('/login')
  } else {
    next()
  }
})

export const registerRouter = (app) => {
  app.use(router)
}

export default router
