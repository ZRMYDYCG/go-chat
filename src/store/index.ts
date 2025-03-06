import { useUserStore } from '@/store/modules/user.ts'
import { createPinia } from 'pinia'

const pinia = createPinia()

export const registerStore = (app) => {
  app.use(pinia)

  const userStore = useUserStore()
  const user = localStorage.getItem('user')

  if (user) {
    userStore.updateUserInfo(JSON.parse(user))
  }

  const token = localStorage.getItem('token')
  if (token) {
    userStore.updateToken(token)
  }
}
