import type { IRoute } from '../../types/index.ts'

const routes: IRoute[] = []

const routesFiles = import.meta.glob('./modules/*.ts', { eager: true }) as Record<string, { default: IRoute }>

Object.entries(routesFiles).forEach(([, module]) => {
  routes.push(module.default)
})

export default routes
