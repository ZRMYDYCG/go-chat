import http from '@/utils/http'

// 添加联系人（好友）
export const createContact = (params) => {
  return http.post('/api/v1/contact/create', params)
}

// 获取联系人列表
export const getContactList = (params) => {
  return http.get('/api/v1/contact/list', params)
}

// 设置联系人备注、描述
export const setContactInfo = (params) => {
  return http.patch('/api/v1/contact/setInfo', params)
}

// 删除联系人（好友）
export const deleteContact = (params) => {
  return http.delete('/api/v1/contact/delete', params)
}
