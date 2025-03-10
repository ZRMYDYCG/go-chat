import { mock, Random } from 'mockjs'
import querystring from 'querystring'

const noteMock = () => {
  // 列表模拟接口
  const contactList: any[] = []
  const count = 100
  for (let i = 0; i < count; i += 1) {
    const note = {
      cover: `https://picsum.photos/300?random=${i}`,
      desc: Random.sentence(3, 15),
      title: Random.sentence(3, 8),
    }

    contactList.push(
      mock({
        id: '@increment',
        ...note,
      }),
    )
  }
  mock(/\/api\/v1\/note\/list/, 'get', (request) => {
    const { keywords = '', page = 1, pageSize = 10 } = querystring.parse(request.url) as any

    const mockList = contactList.filter((item) => {
      // 关键词搜索
      return !(keywords && item.desc.indexOf(keywords) === -1)
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

export default noteMock
