import http from '@/utils/http'

// 账号注册
export const accountRegister = (data) => {
  return http.post('/api/v1/user/regist', data)
}

// 账号密码登录
export const accountLogin = (data) => {
  return http.post('/api/v1/user/login', data)
}

export default {
  accountRegister,
  accountLogin,
}
