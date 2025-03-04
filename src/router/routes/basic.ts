import permissionRoutes from './permission'

// 根路由
export const rootRoute = {
  path: '/',
  name: 'Layout',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      name: 'Home',
      path: '/home',
      component: () => import('@/view/home/index.vue'),
      meta: {
        icon: 'ri-home-smile-2-line',
        activeIcon: 'ri-home-smile-2-fill',
        title: '首页',
      },
    },
    ...permissionRoutes,
  ],
}

// 登录页路由
export const loginRoutes = {
  path: '/login',
  name: 'Login',
  component: () => import('@/view/login/index.vue'),
}

// 注册页路由
export const registerRoutes = {
  path: '/register',
  name: 'Register',
  component: () => import('@/view/register/index.vue'),
}

// 404页路由
export const notFoundRoutes = [
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/view/errors/404/index.vue'),
  },
]

const basicRoutes = [rootRoute, loginRoutes, registerRoutes, ...notFoundRoutes]

export default basicRoutes
