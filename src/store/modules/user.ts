import $api from '@/api'
import { HTTP_CODE, HTTP_HOST } from '@/settings/config/http'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  avatar: string
  [key: string]: any
}

export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref<UserInfo | null>(null)
  const updateUserInfo = (user: UserInfo) => {
    userInfo.value = user

    // 数据持久化
    localStorage.setItem('user', JSON.stringify(user))
  }

  const token = ref<string>('')
  const updateToken = (value: string) => {
    token.value = value

    // 数据持久化
    localStorage.setItem('token', value)
  }

  // 登录action
  const accountLogin = (data: { account: string; password: string }) => {
    return new Promise<void>((resolve, reject) => {
      ;($api as any).login
        .accountLogin(data)
        .then((res) => {
          const { code, data, message } = res.data
          if (code === HTTP_CODE.HTTP_SUCCESS_CODE) {
            const { avatar, ...extra } = data.info
            updateUserInfo({
              avatar: `${HTTP_HOST}upload/avatar/${avatar}`,
              ...extra,
            })
            updateToken(data.token)
            resolve()
          } else {
            reject(message)
          }
        })
        .catch(() => {
          reject('登录失败')
        })
    })
  }

  return {
    userInfo,
    updateUserInfo,
    token,
    updateToken,
    accountLogin,
  }
})
