import useChatStore from '@/store/modules/chat'
import { formatDate } from '@/utils/helper/data'
import { mock, Random } from 'mockjs'
import querystring from 'querystring'
import type { IMessageListVo } from '../types/message/message.vo.ts'

const messageMock = () => {
  // 列表模拟接口
  let messageList: IMessageListVo[] = []
  const getMessagePool = () => {
    const chatStore = useChatStore()
    const { user_id, avatar } = chatStore.activeChat!

    messageList = []
    const count = 100
    for (let i = 0; i < count; i += 1) {
      const message = {
        id: Math.floor(Math.random() * 1000),
        user_id,
        content: Random.sentence(3, 5),
        receiver_id: Math.floor(Math.random() * 1000),
      }
      const extraInfo = {
        is_me: Math.random() > 0.5,
        status: Math.floor(Math.random()),
        send_time: formatDate(new Date()),
        create_time: mock('@datetime'),
      }

      messageList.push(
        mock({
          ...message,
          avatar: avatar,
          ...extraInfo,
        }),
      )
    }
  }
  mock(/\/api\/v1\/message\/list/, 'get', (request) => {
    getMessagePool()

    const { keywords = '', page = 1, pageSize = 20 } = querystring.parse(request.url) as any

    const mockList = messageList.filter((item) => {
      // 关键词搜索
      return !(keywords && item.content.indexOf(keywords) === -1)
    })

    const pageList = mockList.filter((item, index) => {
      return index < page * pageSize && index >= (page - 1) * pageSize
    })

    const count = mockList.length
    return {
      code: 200,
      message: '请求成功',
      data: {
        rows: pageList,
        count,
      },
    }
  })
}

export default messageMock
