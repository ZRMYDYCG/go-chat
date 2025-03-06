import http from '@/utils/http'

// 创建聊天记录
export const createChat = (params) => {
  return http.post('/api/v1/chat/create', params)
}

// 获取聊天记录列表
export const getChatHistoryList = (params) => {
  return http.get('/api/v1/chat/list', params)
}

// 删除聊天记录
export const deleteChat = (params) => {
  return http.delete('/api/v1/chat/delete', params)
}
