import { mock, Random } from 'mockjs'
import querystring from 'querystring'
import type { IContactVo } from '../types/contact/contact.vo.ts'

const contactMock = () => {
  // 列表模拟接口
  const contactList: IContactVo[] = []
  const count = 100
  for (let i = 0; i < count; i += 1) {
    const contact = {
      user_id: Math.floor(Math.random() * 1000),
      account: Random.string(6, 10),
      nickname: mock('@name'),
      remark: mock('@name'),
      desc: Random.sentence(3, 15),
      sex: Math.random() > 0.5 ? '0' : '1',
    }
    const extraInfo = {
      create_time: mock('@datetime'),
    }

    contactList.push(
      mock({
        ...contact,
        avatar: `https://picsum.photos/300?random=${i}`,
        ...extraInfo,
      }),
    )
  }
  mock(/\/api\/v1\/contact\/list/, 'get', (request) => {
    const { keywords = '', page = 1, pageSize = 10 } = querystring.parse(request.url) as any

    const mockList = contactList.filter((item) => {
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

export default contactMock
