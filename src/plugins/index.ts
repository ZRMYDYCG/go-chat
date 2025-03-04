/**
 * 插件注册
 * @param {App} app - Vue 应用实例
 */

import type { App, Plugin } from 'vue'

const modules: Record<string, { default: Plugin }> = import.meta.glob('./modules/*.ts', {
  eager: true,
})

export const registerPlugins = (app: App) => {
  Object.values(modules).forEach((module) => {
    app.use(module.default)
  })
}
