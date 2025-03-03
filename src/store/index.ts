import { createPinia } from 'pinia'

const pinia = createPinia()

export const registerStore = (app) => {
  app.use(pinia)
}
