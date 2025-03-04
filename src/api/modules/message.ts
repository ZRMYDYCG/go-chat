import http from '@/utils/http'

// 获取聊天消息列表
export const getChatMessageList = (params) => {
  return http.get('/api/v1/message/list', params)
}

export default {
  getChatMessageList,
}
