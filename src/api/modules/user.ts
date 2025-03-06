import http from '@/utils/http'

// 搜索用户列表
export const searchUserList = (params) => {
  return http.get('/api/v1/user/searchUser', params)
}
