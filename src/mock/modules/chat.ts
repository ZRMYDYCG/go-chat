import { mock, Random } from 'mockjs'
import querystring from 'querystring'
import type { IChatListVo } from '../types/chat/chat.vo.ts'

const chatMock = () => {
  /**
   * 聊天列表模拟接口
   * */
  const chatList: IChatListVo[] = []
  const count = 100
  for (let i = 0; i < count; i += 1) {
    const chat = {
      user_id: Math.floor(Math.random() * 1000),
      nickname: mock('@name'),
      slogan: Random.sentence(3, 5),
      last_message: Random.sentence(3, 5),
    }
    const extraInfo = {
      send_time: mock('@datetime'),
      create_time: mock('@datetime'),
    }

    chatList.push(
      mock({
        ...chat,
        avatar: `https://picsum.photos/300?random=${i}`,
        ...extraInfo,
      }),
    )
  }
  mock(/\/api\/v1\/chat\/list/, 'get', (request) => {
    const queryParams = querystring.parse(request.url) as Record<string, string>

    const keywords = queryParams.keywords || ''
    const page = parseInt(queryParams.page || '1', 10)
    const pageSize = parseInt(queryParams.pageSize || '10', 10)

    const mockList = chatList.filter((item) => {
      // 关键词搜索
      return !(keywords && item.nickname.indexOf(keywords) === -1)
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

export default chatMock
