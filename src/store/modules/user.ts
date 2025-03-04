import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('userStore', () => {
  const token = ref('has-token')
  const userInfo = ref<{
    nickname: string
    avatar: string
    account: string
  }>()

  const updateUserInfo = (user) => {
    userInfo.value = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  const updateToken = (token) => {
    token.value = token
    localStorage.setItem('token', JSON.stringify(token))
  }

  const loginAction = () => {
    return new Promise(() => {})
  }

  return {
    token,
    userInfo,
    updateUserInfo,
    updateToken,
    loginAction,
  }
})

export default useUserStore
