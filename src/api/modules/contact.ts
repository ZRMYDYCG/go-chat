import http from '@/utils/http'

// 获取联系人列表
export const getContactList = (params) => {
  return http.get('/api/v1/contact/list', params)
}

export default {
  getContactList,
}
