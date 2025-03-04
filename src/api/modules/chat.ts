import http from '@/utils/http'

// 获取聊天记录列表
export const getChatHistoryList = (params) => {
  return http.get('/api/v1/chat/list', params)
}

export default {
  getChatHistoryList,
}
